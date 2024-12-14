{
  description = "A Nix-flake-based Node.js development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11"; # latest stable version at this time

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import nixpkgs { inherit system; overlays = [ self.overlays.default ]; };
      });
    in
    {
      overlays.default = final: prev: rec {
        nodejs = prev.nodejs;
      };

      devShells = forEachSupportedSystem ({ pkgs }: {
        default = pkgs.mkShell {
          packages = with pkgs; [
          node2nix
          nodejs
          pre-commit
          ];

          shellHook = ''
            npm ci
            export PATH=$PATH:$PWD/bin
          '';
          TEST="Hello Cloud Native Austria Contributor! :D";
        };
      });
    };
}
