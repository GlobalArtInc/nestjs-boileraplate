set -e

DIR=/workspace
PROJECT_NAME=nest
REPO_URL=git@github.com:GlobalArtInc/nestjs-boileraplate.git
# cd $DIR
mkdir -p /workspace
cd $DIR

if ! [ -d $DIR/$PROJECT_NAME ]; then
    echo "Cloning repository..."
    git clone $REPO_URL $PROJECT_NAME
    cd $DIR/$PROJECT_NAME
fi

