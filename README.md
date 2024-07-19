Deploy via WERF

```
werf converge 
  --skip-build
  --env=$tag_ns
  --kube-config=$k8s_cluster 
  --require-built-images 
  --synchronization :local 
  --insecure-registry=true 
  --skip-tls-verify-registry=true 
  --repo-container-registry=harbor 
  --repo=$HARBOR_HOST/${repo_tag}/$CI_PROJECT_NAME 
  --repo-harbor-username=$HARBOR_USERNAME
  --repo-harbor-password=$HARBOR_PASSWORD 
  --atomic=true 
  ${values_param}
  ${secret_values_param}
  ${ci_values}
  --loose-giterminism=true 
  --parallel=false 
  --config=$config_werf
  --set APPNAME=$APPNAME
  --set werf_config=$werf_config
  --config=$config_werf
