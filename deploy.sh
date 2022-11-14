set -Eeuo pipefail

yarn build
tar_dir=$(mktemp -d -t caprover.XXXXXXXXXX)
tar_path="$tar_dir/deploy.tar"
echo "Temp archive path: $tar_path"
tar -cf "$tar_path" --exclude='*.map' ./captain-definition ./dist/*
caprover deploy -t "$tar_path" --default
# rm -fr "$tar_dir"