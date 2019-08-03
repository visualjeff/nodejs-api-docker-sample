#!/usr/bin/env bash

# Integration Test Harness
# By Jeffrey GIlbert <jgilber@costco.com>


TLS=false
TLSPort=443
PROTOCOL="http"
HOST=localhost

if($TLS); then
echo 'taking true TLS Branch'
PROTOCOL="https";
fi


# Simple bash function to parse json.  Eliminates the need for addition or external dependencies.
function parse_json()
{
    echo $1 | \
    sed -e 's/[{}]/''/g' | \
    sed -e 's/", "/'\",\"'/g' | \
    sed -e 's/" ,"/'\",\"'/g' | \
    sed -e 's/" , "/'\",\"'/g' | \
    sed -e 's/","/'\"---SEPERATOR---\"'/g' | \
    awk -F=':' -v RS='---SEPERATOR---' "\$1~/\"$2\"/ {print}" | \
    sed -e "s/\"$2\"://" | \
    tr -d "\n\t" | \
    sed -e 's/\\"/"/g' | \
    sed -e 's/\\\\/\\/g' | \
    sed -e 's/^[ \t]*//g' | \
    sed -e 's/^"//'  -e 's/"$//'
}

function coloredEcho(){
    local exp=$1;
    local color=$2;
    if ! [[ $color =~ '^[0-9]$' ]] ; then
	case $(echo $color | tr '[:upper:]' '[:lower:]') in
		black) color=0 ;;
		red) color=1 ;;
		green) color=2 ;;
		yellow) color=3 ;;
		blue) color=4 ;;
		magenta) color=5 ;;
		cyan) color=6 ;;
		white|*) color=7 ;; # white or invalid color
	esac
    fi
    tput setaf $color;
    echo $exp;
    tput sgr0;
}


coloredEcho "Test run STARTED." green
echo ""

coloredEcho "Endpoint--$PROTOCOL://$HOST:$TLSPort/" green
echo ""
echo ""

# If you need to debug add the following to your curl command:   --trace-ascii /dev/stdout

coloredEcho "1. Creating a child" green
JSON_RETURN_VALUE=$(curl -slk -X POST "http://localhost:1337/add" -H "accept: application/json" -H "Content-Type: application/x-www-form-urlencoded" -d "name=bob&legs=5")
coloredEcho "  JSON_RETURN_VALUE: $(echo $JSON_RETURN_VALUE)" green

echo ""
echo ""
sleep 1

coloredEcho "2. Getting the clild" green
JSON_RETURN_VALUE=$(curl -slk -X GET "http://localhost:1337/bob" -H "accept: application/json")
coloredEcho "  JSON_RETURN_VALUE: $(echo $JSON_RETURN_VALUE)" green

echo ""
echo ""
sleep 1

coloredEcho "3. Getting all of the children" green
JSON_RETURN_VALUE=$(curl -slk -X GET "http://localhost:1337/" -H "accept: application/json")
coloredEcho "  JSON_RETURN_VALUE: $(echo $JSON_RETURN_VALUE)" green

echo ""
echo ""
sleep 1

coloredEcho "4. Updating the child" green
JSON_RETURN_VALUE=$(curl -slk -X PATCH "http://localhost:1337/update" -H "accept: application/json" -H "Content-Type: application/x-www-form-urlencoded" -d "name=bob&legs=3")
coloredEcho "  JSON_RETURN_VALUE: $(echo $JSON_RETURN_VALUE)" green

echo ""
echo ""
sleep 1

coloredEcho "5. Getting the clild we just updated" green
JSON_RETURN_VALUE=$(curl -slk -X GET "http://localhost:1337/bob" -H "accept: application/json")
coloredEcho "  JSON_RETURN_VALUE: $(echo $JSON_RETURN_VALUE)" green
echo ""
echo ""
sleep 1

coloredEcho "6. Deleting the child" green
JSON_RETURN_VALUE=$(curl -slk -X DELETE "http://localhost:1337/delete" -H "accept: application/json" -H "Content-Type: application/x-www-form-urlencoded" -d "name=bob")
coloredEcho "  JSON_RETURN_VALUE: $(echo $JSON_RETURN_VALUE)" green

echo ""
echo ""
sleep 1

coloredEcho "7. Getting all of the children to make sure we deleted bob" green
JSON_RETURN_VALUE=$(curl -slk -X GET "http://localhost:1337/" -H "accept: application/json")
coloredEcho "  JSON_RETURN_VALUE: $(echo $JSON_RETURN_VALUE)" green
echo ""
coloredEcho "Test run COMPLETE." green

exit 0
