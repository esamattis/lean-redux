export PATH := ../node_modules/.bin:$(PATH)
export SHELL := /bin/bash # Required for OS X for some reason

distfile = dist/bundle.js dist/bundle.js.map

js: dist-changes-hide
	webpack -d --progress

server:
	python -m SimpleHTTPServer 8080

js-server:
	webpack-dev-server -d --inline --host 0.0.0.0

js-watch:
	webpack -d --progress --watch

dist-changes-hide:
	git update-index --assume-unchanged $(distfile)

dist-changes-show:
	git update-index --no-assume-unchanged $(distfile)

lint:
	eslint $(shell git ls-files "*.js" | grep -v dist)

assert-clean-git: dist-changes-show
	git checkout $(distfile)
	@test -z "$(shell git status --porcelain)" || (echo "Dirty git tree: " && git status . --porcelain ; exit 1)

release: assert-clean-git lint js
	$(MAKE) dist-changes-show
	git add $(distfile)
	git status . --porcelain
	git commit -m "Commit examples bundle"

