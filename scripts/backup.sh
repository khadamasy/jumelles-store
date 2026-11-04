#!/bin/sh
# Sauvegarde quotidienne : base PostgreSQL (pg_dump) + photos MinIO (archive tar).
# Les fichiers sont écrits dans ./backups sur le serveur : copiez-les régulièrement
# ailleurs (ordinateur, Google Drive...) pour vous protéger d'une panne du serveur.
set -u
RETENTION="${BACKUP_RETENTION_DAYS:-14}"
mkdir -p /backups

while true; do
  STAMP=$(date +%Y%m%d-%H%M)
  if pg_dump -Fc -f "/backups/base-$STAMP.dump.tmp"; then
    mv "/backups/base-$STAMP.dump.tmp" "/backups/base-$STAMP.dump"
    echo "[Sauvegarde] Base OK : base-$STAMP.dump"
  else
    rm -f "/backups/base-$STAMP.dump.tmp"
    echo "[Sauvegarde] ÉCHEC de la sauvegarde de la base" >&2
  fi

  if tar -czf "/backups/photos-$STAMP.tar.gz.tmp" -C /minio_data . 2>/dev/null; then
    mv "/backups/photos-$STAMP.tar.gz.tmp" "/backups/photos-$STAMP.tar.gz"
    echo "[Sauvegarde] Photos OK : photos-$STAMP.tar.gz"
  else
    rm -f "/backups/photos-$STAMP.tar.gz.tmp"
    echo "[Sauvegarde] ÉCHEC de la sauvegarde des photos" >&2
  fi

  # Rotation : suppression des sauvegardes plus anciennes que RETENTION jours
  find /backups -type f \( -name 'base-*.dump' -o -name 'photos-*.tar.gz' \) -mtime +"$RETENTION" -delete

  sleep 86400
done
