#!/bin/bash

VERSION=$1

if [[ -f ./.helm/def.sh ]]; then  
    source ./.helm/def.sh && $VERSION
fi

if [ -e ".helm/values-$ENVNAME.yaml" ]; then 
    values_param="--values=.helm/values-$ENVNAME.yaml"
fi

if [ -e ".helm/secrets-$ENVNAME.yaml" ]; then 
    secret_values_param="--secret-values=.helm/secrets-$ENVNAME.yaml"
fi

def_content=$(set | awk "/^${ENVNAME} \(\)/,/\}/")
if [[ ! -z "$def_content" ]]; then
    ci_values=$(echo "$def_content" | awk '/export CI_/ {gsub("export ", ""); print}' | sed 's/\(.*\)=\(.*\)/--set \L\1\E=\2/' | tr -d ';')
fi

if [[ "$ENVNAME" == "dev" || "$ENVNAME" == "kvm" ]]; then
    kubectl create ns $NAMESPACE-$ENVNAME || true
    cat <<EOF | kubectl -n $NAMESPACE-$ENVNAME apply -f -
kind: Secret
apiVersion: v1
metadata:
  name: id-rsa-vcs
data:
  id_rsa: $(cat ~/.ssh/id_rsa | base64 -w0)
type: Opaque
EOF
fi

werf converge \
  --env=$ENVNAME \
  --synchronization=:local \
  --insecure-registry=true \
  --skip-tls-verify-registry=true \
  ${values_param} \
  ${secret_values_param} \
  ${ci_values} \
  --loose-giterminism=true \
  --parallel=false \
  --set APPNAME=$APPNAME \
  --repo=registry.ingress.local/nest
