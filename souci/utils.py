from paddleocr import PaddleOCR,draw_ocr

def paddleocr_extract(image_location, lang='en'):
    ocr = PaddleOCR(use_angle_cls=True, lang=lang)
    result = ocr.ocr(image_location, cls=True)
    return result

# for idx in range(len(result)):
#     res = result[idx]
#     for line in res:
#         print(line)