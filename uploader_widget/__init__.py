from ._version import version_info, __version__

from .uploader import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'uploader_widget',
        'require': 'uploader_widget/extension'
    }]
