from doctr.io import DocumentFile
from doctr.models import ocr_predictor

### using doctr for OCR --> https://github.com/mindee/doctr

def ocr_extract(image_location):
    model = ocr_predictor(pretrained=True)
    image = DocumentFile.from_images(image_location)
    result = model(image)
    return result.export()