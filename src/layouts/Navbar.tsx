import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem, Badge } from "@heroui/react";

interface NavbarProps {
  cartItemsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ cartItemsCount }) => {
  return (
    <HeroNavbar isBordered className="bg-background/70 backdrop-blur-md">
      <NavbarBrand>
        <svg
          className="w-8 h-8 text-primary mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="font-bold text-xl text-primary">Pagos Diferidos</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Badge content={cartItemsCount} color="primary" shape="circle" size="sm">
            <svg
              className="w-6 h-6 text-default-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </Badge>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
};