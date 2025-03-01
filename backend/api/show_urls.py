from django.urls import get_resolver # type: ignore

def list_urls():
    urls = get_resolver().url_patterns
    for url in urls:
        print(url)

list_urls()
