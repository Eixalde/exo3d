server:
	python3 -m http.server

doc NAME:
	npx jsdoc2md -c jsdoc.conf.json --separators modules/{{NAME}}.mjs > docs/{{NAME}}_doc.md

pandoc NAME:
	#!/usr/bin/env bash
	set -euxo pipefail
	cd docs
	pandoc {{NAME}}_to_pdf.md -o {{NAME}}.pdf
