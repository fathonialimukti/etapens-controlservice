#!/bin/bash

while [ $# -gt 0 ] ; do
  case $1 in
    -u | --username) username="$2" ;;
    -f | --frontend) type="frontend" ;;
    -b | --backend) type="backend" ;;
    \?) echo "Error" exit ;;
  esac
  shift
done

rm -rf /mnt/Supporter/Informatika/LJ\ D4/TA/app/apps/$username/$type

echo -n "Application from user ${username} with type ${type} deleted"
