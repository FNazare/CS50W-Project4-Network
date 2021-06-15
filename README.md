# Network

A Twitter-like Python web app built with Django.

This project is part of the [CS50’s Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/2020/).

## Setup

### 1 - Install Django

If you have Python and Pip already installed:
```bash
python3 -m pip install Django
```
or follow [Django's Official Documentation](https://docs.djangoproject.com/en/3.2/topics/install/#installing-official-release).

### 2 - Setup
Clone this repository and move into the directory:

```bash
git clone https://github.com/FNazare/CS50W-Project4-Network.git
```
```bash
cd CS50W-Project4-Network
```
Setup the database:

```bash
python3 manage.py migrate
```

### 3 - Run
Run development server:
```bash
python3 manage.py runserver
```
Visit http://127.0.0.1:8000/
