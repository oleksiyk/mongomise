all: mongomise


node_modules: package.json
	@npm install


mongomise: node_modules lib/*


#
# Tests
#
test: mongomise
	@mocha


#
# Coverage
#
lib-cov: clean-cov
	@jscoverage --no-highlight lib lib-cov

test-cov: lib-cov
	@MONGOMISE_COV=1 mocha \
		--require ./test/globals \
		--reporter html-cov \
		> coverage.html

#
# Clean up
#

clean: clean-node clean-cov

clean-node:
	@rm -rf node_modules

clean-cov:
	@rm -rf lib-cov
	@rm -f coverage.html

.PHONY: all
.PHONY: test

