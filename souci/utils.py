from doctr.io import DocumentFile
from doctr.models import ocr_predictor
from paddleocr import PaddleOCR,draw_ocr

### using doctr for OCR --> https://github.com/mindee/doctr

def doctr_extract(image_location):
    model = ocr_predictor(pretrained=True)
    image = DocumentFile.from_images(image_location)
    result = model(image)
    return result.export()

def paddleocr_extract(image_location, lang='en'):
    ocr = PaddleOCR(use_angle_cls=True, lang=lang)
    result = ocr.ocr(image_location, cls=True)
    return result