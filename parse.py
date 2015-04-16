#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import glob
import json

PWD = os.path.dirname(__file__)
DATA_DIR = os.path.join(PWD, 'data')


def parse_doc(doc_path):
    id = os.path.splitext(os.path.basename(doc_path))[0]
    data = json.load(open(doc_path, 'r'))
    assert data['type'] == 'album'
    assert data['id'] == id
    name = data['name']
    artists = data['artists']
    images = data.get('images', [])
    if not images:
        print 'images not found for "{}"'.format(name)
        # TODO make it work
        return {}
    release_date = data['release_date']
    uri = data['uri']
    assert uri == 'spotify:album:{}'.format(id)
    return {'id': id,
            'name': name,
            'images': images,
            'release_date': release_date,
            'uri': uri,
            'artists': artists}


def main():
    docs = glob.glob('{}/*.json'.format(DATA_DIR))
    data_list = filter(bool, map(parse_doc, docs))
    open(os.path.join(PWD, 'data.json'), 'w').write(
        json.dumps({album['id']: album for album in data_list}, indent=2))


if __name__ == '__main__':
    main()
