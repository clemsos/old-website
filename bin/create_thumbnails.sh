#!/bin/bash
# create a clean thumbnail.png from a thumb* file

THUMB_WIDTH=240
THUMB_HEIGHT=200

## loop through posts
for content_folder in "_websites" "_workshops" "_projects"
do
  POSTS_FOLDER=`pwd`/${content_folder}
  for content in `find ${POSTS_FOLDER} -maxdepth 1 -mindepth 1 -type d`
  do
    for file in `find ${content} -type f -name "thumb*" -o -name "thubmnail.png"`
    do
      IMAGE_TYPE=`file --mime-type -b "$file" | awk -F'/' '{print $1}'`
      if [ x$IMAGE_TYPE = "ximage" ]; then
          filename=$(basename "$file")
          if [[ ! -f ${content}/"thumbnail.png" ]]; then # check if thumbnail already exists
            echo "building" $filename
            convert -define size=240x240 "$file" -thumbnail ${THUMB_WIDTH}x${THUMB_HEIGHT}^ -gravity center -extent ${THUMB_WIDTH}x${THUMB_HEIGHT}  "${content}/thumbnail.png"
          fi
      fi
    done
  done
done

#do
#echo $IMAGE_TYPE
# if [ x$IMAGE_TYPE = "ximage" ]; then
#   IMAGE_SIZE=`file -b $file | sed 's/ //g' | sed 's/,/ /g' | awk  '{print $2}'`
  #     WIDTH=`echo $IMAGE_SIZE | sed 's/x/ /g' | awk '{print $1}'`
  #     HEIGHT=`echo $IMAGE_SIZE | sed 's/x/ /g' | awk '{print $2}'`


  # next line checks the mime-type of the file
  # IMAGE_TYPE=`file --mime-type -b "$file" | awk -F'/' '{print $1}'`
  # if [ x$IMAGE_TYPE = "ximage" ]; then
  #     IMAGE_SIZE=`file -b $file | sed 's/ //g' | sed 's/,/ /g' | awk  '{print $2}'`
  #     WIDTH=`echo $IMAGE_SIZE | sed 's/x/ /g' | awk '{print $1}'`
  #     HEIGHT=`echo $IMAGE_SIZE | sed 's/x/ /g' | awk '{print $2}'`
  #     # If the image width is greater that 200 or the height is greater that 150 a thumb is created
  #    if [ $WIDTH -ge  201 ] || [ $HEIGHT -ge 151 ]; then
  #       #This line convert the image in a 200 x 150 thumb
  #       filename=$(basename "$file")
  #       extension="${filename##*.}"
  #       filename="${filename%.*}"
  #       convert -sample 200x150 "$file" "${THUMBS_FOLDER}/${filename}_thumb.${extension}"
  #    fi
  # fi
#done
