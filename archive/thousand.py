#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
"""
import csv

from chub.api import API as Spotify

BASE_URL = "https://api.spotify.com"
spotify = Spotify(BASE_URL, async=False, api_version='v1')


class NotFound(Exception):

    def __init__(self, album_name, artist_name):
        self.album_name = album_name
        self.artist_name = artist_name


def search_albums(album_name):
    albums = spotify.search.get(
        q=album_name, type="album", market="GB")['albums']['items']
    return albums


def find_album(album_name, artist_name, market="GB"):
    albums = search_albums(album_name)
    album_id_list = [album['id'] for album in albums['items']]
    for album_id in album_id_list:
        album = spotify.albums(album_id).get(market='GB')
        for artist in album['artists']:
            if artist_name.decode('utf-8') in artist['name']:
                return album
    else:
        raise NotFound(album_name, artist_name)


def precise_match(filename):
    fieldnames = ['spotify_id', 'title', 'artist', 'release_date']
    writer = csv.DictWriter(open('spotify.csv', 'w'),
                            fieldnames=fieldnames, delimiter='\t')
    writer.writeheader()
    items = csv.DictReader(open(filename, 'r'), delimiter='\t')
    # for item in islice(items, 28, 100):
    for item in items:
        album_name = item['title']
        artist_name = item['artist']
        print album_name, artist_name
        try:
            album_id = find_album(album_name, artist_name)['id']
            print 'spotify id:', album_id
        except NotFound:
            album_id = None
            print 'not found'
        item['spotify_id'] = album_id
        writer.writerow(item)


def fuzzy_match_by_artist():
    fieldnames = ['spotify_id', 'spotify_artist',
                  'title', 'artist', 'release_date']
    writer = csv.DictWriter(open('fuzzy.csv', 'w'),
                            fieldnames=fieldnames, delimiter='\t')
    writer.writeheader()
    items = csv.DictReader(open('notfound.csv', 'r'), delimiter='\t')
    for item in items:
        album_name = item['title']
        artist_name = item['artist']
        print album_name, artist_name
        try:
            album_id = search_albums(album_name)[0]['id']
            album = spotify.albums(album_id).get(market='GB')
            print 'spotify id:', album_id
        except IndexError:
            album_id = None
            spotify_artist = None
            print 'not found'
        else:
            spotify_artist = ','.join(
                map(lambda x: x['name'], album.get('artists', []))
            ).encode('utf-8')
        item['spotify_artist'] = spotify_artist
        item['spotify_id'] = album_id
        writer.writerow(item)


if __name__ == '__main__':
    precise_match('1001.csv')
    fuzzy_match_by_artist()
