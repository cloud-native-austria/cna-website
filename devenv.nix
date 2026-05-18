{ pkgs, ... }:

{
  languages.javascript = {
    enable = true;
    npm.enable = true;
  };

  git-hooks.hooks = {
    trim-trailing-whitespace.enable = true;
    end-of-file-fixer.enable = true;
    fix-byte-order-marker.enable = true;
    check-added-large-files.enable = true;
    check-json.enable = true;
    check-yaml.enable = true;
    check-toml.enable = true;
    check-xml.enable = true;
    check-merge-conflicts.enable = true;
    detect-private-keys.enable = true;
    forbid-new-submodules.enable = true;
    pretty-format-json = {
      enable = true;
      settings = {
        autofix = true;
        no-ensure-ascii = true;
      };
    };
  };

  enterShell = ''
    export PATH=$PATH:$DEVENV_ROOT/bin
    echo "CNA Website environment loaded"
    echo "  npm  : $(npm --version)"
    echo "  node : $(node --version)"
  '';
}
