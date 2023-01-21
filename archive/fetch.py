#!/usr/bin/env python
# -*- coding: utf-8 -*-
import csv
import os
import json

from thousand import spotify

PWD = os.path.dirname(__file__)
DATA_DIR = os.path.join(PWD, 'data')


def dump_album_data(spotify_id):
    album = spotify.albums(spotify_id).get(market='GB')
    filename = os.path.join(DATA_DIR, spotify_id + '.json')
    with open(filename, 'w') as ff:
        ff.write(json.dumps(album, indent=2))


def fetch_json():
    reader = csv.DictReader(
        open(os.path.join(PWD, 'spotify.csv'), 'r'),
        delimiter='\t')
    # for item in islice(reader, 200, None):
    for item in reader:
        print item
        dump_album_data(item['spotify_id'])


def main():
    fetch_json()


if __name__ == '__main__':
    main()
