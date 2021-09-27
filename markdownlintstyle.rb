################################################################################
# Style file for markdownlint.
#
# https://github.com/markdownlint/markdownlint/blob/master/docs/configuration.md
#
# This file is referenced by the project `.mdlrc`.
################################################################################

#===============================================================================
# Start with all built-in rules.
# https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md
all

#===============================================================================
# Override default parameters for some built-in rules.
# https://github.com/markdownlint/markdownlint/blob/master/docs/creating_styles.md#parameters

# Ignore line length in code blocks.
rule 'MD013', code_blocks: false, line_length: 88

#===============================================================================
# Exclude the rules I disagree with.

# IMHO it's easier to read lists like:
# * outmost indent
#   - one indent
#   - second indent
# * Another major bullet
exclude_rule 'MD004' # Unordered list style

# IMHO it's sometimes usefull to have 2 different headings with the same name
# especialy when describing different version of a procedure
exclude_rule 'MD024' # Multiple headings with the same content

#===============================================================================
# Exclude rules for pragmatic reasons.

# Does not handle well files with YAML front matter
exclude_rule 'MD041' # First line in file should be a top level heading
