chmod 744 ${PWD}/installation.sh
chmod 744 ${PWD}/containers.sh

(
./installation.sh
) &

wait

(
./containers.sh
)
