#!/usr/bin/env bash

jupyter nbextension uninstall --py --sys-prefix uploader_widget
rm -rf uploader_widget/static/
python setup.py build
pip install -e .
jupyter nbextension install --py --symlink --sys-prefix uploader_widget
jupyter nbextension enable --py --sys-prefix uploader_widget
