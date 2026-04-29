{ pkgs, ... }:

{
  packages = with pkgs; [
    pre-commit
  ];

  languages.javascript = {
    enable = true;
    npm.enable = true;
  };

  enterShell = ''
    export PATH=$PATH:$DEVENV_ROOT/bin
    echo "CNA Website environment loaded"
    echo "  npm         : $(npm --version)"
    echo "  pre-commit  : $(pre-commit --version)"
    echo "  node        : $(node --version)"
  '';
}
