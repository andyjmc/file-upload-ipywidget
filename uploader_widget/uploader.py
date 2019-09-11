import ipywidgets as widgets
from traitlets import Unicode, Int, Bool, Any
from traitlets import observe
import base64
from math import ceil

@widgets.register
class FileUploader(widgets.DOMWidget):
    """An example widget."""
    _view_name = Unicode('UploaderView').tag(sync=True)
    _model_name = Unicode('UploaderModel').tag(sync=True)
    _view_module = Unicode('uploader_widget').tag(sync=True)
    _model_module = Unicode('uploader_widget').tag(sync=True)
    _view_module_version = Unicode('^0.0.1').tag(sync=True)
    _model_module_version = Unicode('^0.0.1').tag(sync=True)

    base64_data_blob = Unicode().tag(sync=True)
    file= Any().tag(sync=True)
    next_slice = Int().tag(sync=True)
    file_size = Int().tag(sync=True)
    file_name = Unicode().tag(sync=True)
    file_type = Unicode().tag(sync=True)
    next_blob = Int().tag(sync=True)
    base64_data = Unicode().tag(sync=True)
    label = Unicode("Upload a File").tag(sync=True)
    new_file = Bool().tag(sync=True)
    disabled = Bool().tag(sync=True)
    data = ''

    @observe("new_file")
    def clear_data(self, change):
        if self.new_file:
            self.data = ''
            self.new_file = False

    @observe("base64_data")
    def _update_label(self, change):
        self.label = self._label() or self.label

    @observe("base64_data_blob")
    def save__blob_and_request_next(self, change):
        bytes_string = base64.b64decode(self.base64_data_blob.split(',')[1])
        self.data += bytes_string.decode(encoding="utf-8", errors="ignore")
        if self.next_slice < self.file_size:
            self.next_blob = self.next_slice
            self.label = f'Uploading {self.file_name} - {ceil((self.next_slice/self.file_size)*100)}%'
        else:
            self.label = f'{self.file_name} uploaded'


    def _label(self):
        return "{} bytes uploaded {}".format(
            len(self.base64_data),
            self.base64_data.split(";")[0])
