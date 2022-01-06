server:
	python3 -m http.server

doc NAME:
	npx jsdoc2md -c jsdoc.conf.json --separators modules/{{NAME}}.mjs > docs/{{NAME}}_doc.md
