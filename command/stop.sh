#!/bin/bash

############################################################
# Help                                                     #
############################################################
Help()
{
   # Display Help
   echo "Bash script for deploymeny."
   echo
   echo "Syntax: scriptTemplate [pid]"
   echo "options:"
   echo
   echo "-pid     process Id."
   echo
}

############################################################
############################################################
# Main program                                             #
############################################################
############################################################


############################################################
# Process the input options. Add options as needed.        #
############################################################
# Get the options

while [ $# -gt 0 ] ; do
  case $1 in
    -pid) pid="$2" ;;
    \?) echo "Error" exit ;;
  esac
  shift
done


{ # try 

    # cleaning up
    kill -15 $pid
    # stop
    kill -9 $pid

} || { # catch
  echo "ERROR"
}

echo "OK"
