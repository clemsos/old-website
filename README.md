# clemsos.github.io

Personal website clemsos.github.io (built with Jekyll).

### Build thumbnails

    convert -define size=240x240 IMG_0425.JPG -thumbnail 240x200^ -gravity center -extent 240x200 thumbnail.png

    # see also 
    sh bin/create_thumbnails.sh
