# Set the path to clang-format according to OS
CLANG_FORMAT :=
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		CLANG_FORMAT += node_modules/clang-format/bin/linux_x64/clang-format --style=Google
	else
		CLANG_FORMAT += node_modules/clang-format/bin/darwin_x64/clang-format --style=Google
	endif

ESLINT=node_modules/eslint/bin/eslint.js
PRETTIER=node_modules/prettier/bin-prettier.js

node_modules:
	npm install clang-format prettier eslint@6.6.0 react@16.13.1 eslint-config-react-app babel-eslint eslint-plugin-import eslint-plugin-flowtype eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks

pretty: node_modules
	$(PRETTIER) --write 'frontend/src/**/*.css'
	$(PRETTIER) --write 'frontend/src/**/*.js'
	find backend/src -iname *.java | xargs $(CLANG_FORMAT) -i

validate: node_modules
	$(ESLINT) 'frontend/src/**/*.js'
