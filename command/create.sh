#!/bin/bash

############################################################
# Help                                                     #
############################################################
Help()
{
   # Display Help
   echo "Bash script for deploymeny."
   echo
   echo "Syntax: scriptTemplate [l|p|n]"
   echo "options:"
   echo
   echo "-l | --repository-link     For repository link."
   echo "-p | --application-port    For application port."
   echo "-b    			    If application is a backend."
   echo "-f			    If application is a frontend or a main project."
   echo "-u | --username	    username."
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
    -s | --source-code) sourceCode="$2" ;;
    -p | --port) port="$2" ;;
    -b) type="backend" ;;
    -f) type="frontend" ;;
    -u | --username) usernamename="$2" ;;
    -h) Help exit ;;
    \?) echo "Error" exit ;;
  esac
  shift
done

appsDir = "/mnt/Supporter/Informatika/LJ D4/TA/app/apps"

{ # try 

  # Cloning App from repository
  git clone $sourceCode $appsDir/$username/$type
  cd $username/$type
  pnpm i -P
  pnpm build
  pnpm start --port $port

} || { # catch

  echo "ERROR" exit
}

echo "OK"
