chmod 744 ${PWD}/scripts/installation.sh
chmod 744 ${PWD}/scripts/containers.sh

(
./scripts/installation.sh
) &

wait

(
./scripts/containers.sh
)
