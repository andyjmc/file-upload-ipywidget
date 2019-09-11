uploader widget
===============================

A widget to upload files to jupyter

Installation
------------

To install use pip:

    $ pip install git+https://github.com/andyjmc/file-upload-ipywidget
    $ $ jupyter nbextension install --py --symlink --sys-prefix uploader_widget
    $ jupyter nbextension enable --py --sys-prefix uploader_widget


For a development installation (requires npm),

    $ git clone https://github.com/andyjmc/file-upload-ipywidget
    $ cd uploader-widget
    $ python setup build
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix uploader_widget
    $ jupyter nbextension enable --py --sys-prefix uploader_widget
