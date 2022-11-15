#!/bin/bash

while [ $# -gt 0 ] ; do
  case $1 in
    -t | --test) test="$2" ;;
    \?) echo "Error" exit ;;
  esac
  shift
done

echo -n $test
