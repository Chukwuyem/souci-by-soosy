# souci-by-soosy
An OCR application that captures an image and extracts text from it.

Uses a Django backend and a nextjs frontend (located within the `frontend` folder). No DB currently setup (image files are saved in `/media`).

Uses [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) for character recognition.


## Installation

Clone repo

```bash
git clone <repo_url>
```
    
Setup virtualenv and activate

```bash
python3 -m venv myenv
source myenv/bin/activate
```

Install requirements

```bash
pip install -r requirements.txt
```

Startup the django backend

```bash
python manage.py migrate
python manage.py runserver
```

In a new terminal, open and start the frontend

```bash
npm install
npm run dev
```