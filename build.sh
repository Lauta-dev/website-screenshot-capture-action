#!/bin/bash

commit=$1
tag_name=$2
tag_ver=$3

get_date() {
  echo "EJECUTADO EL ---------------------"
  date
  echo "---------------------------------"
  echo " "
}

compile() {
  echo "-----| Compilando proyecto |-----"
  npx ncc build index.ts --license licenses.txt
  echo "--------------------------------------"
  echo " "
}

git_add() {
  echo "-----| git add . |-----"
  git add .
  echo "--------------------------------------"
  echo " "
}

git_commit() {
  echo "-----| git commit -m $commit |-----"
  git commit -m "$commit"
  echo "--------------------------------------"
  echo " "
}

git_tag() {
  echo "-----| git tag -a -m $tag_name v$tag_ver |-----"
  git tag -a -m "$tag_name" $tag_ver
  echo "--------------------------------------"
  echo " "
}

git_push() {
  echo "git push --follow-tags"
  git push --follow-tags
  git push
}

get_date
compile
git_add
git_commit
git_tag
git_push
