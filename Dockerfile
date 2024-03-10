# Dockerfile

FROM python:3.9

# Set the working directory in the container
ENV APP_HOME=/app
WORKDIR ${APP_HOME}


# Install system dependencies
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx && \
    apt-get clean

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Run the Django application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]