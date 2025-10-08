import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  ShoppingCart,
  Settings,
  Menu,
  X,
  Leaf,
  BarChart3,
  Award,
  ClipboardList,
  Wrench,
  Box,
  Building,
  Shield,
  DollarSign,
  Brain,
  Download,
  ChevronDown,
  MoreHorizontal,
  Database,
  Scale,
  Activity,
  Layers,
  Hash,
  Zap,
  Cloud
} from "lucide-react";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isTabletMoreOpen, setIsTabletMoreOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setOpenDropdown(null);
      setIsTabletMoreOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const coreNavigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
      description: "Overview & key metrics"
    },
    {
      title: "Order & Stock",
      href: "/order-stock",
      icon: ShoppingCart,
      description: "Purchase orders & inventory"
    },
    {
      title: "Production Plan",
      href: "/production-plan",
      icon: ClipboardList,
      description: "Production planning & instructions"
    }
  ];

  const managementItems = [
    {
      title: "Finished Products",
      href: "/finished-products",
      icon: Box,
      description: "Product inventory & certificates"
    },
    {
      title: "Supplier Portal",
      href: "/supplier-portal",
      icon: Building,
      description: "Supplier management & relations"
    },
    {
      title: "Quality Management",
      href: "/quality",
      icon: Shield,
      description: "Quality control & compliance"
    },
    {
      title: "Cost Analysis",
      href: "/cost-analysis",
      icon: DollarSign,
      description: "Cost tracking & optimization"
    },
    {
      title: "Edge Collectors",
      href: "/edge-collectors",
      icon: Activity,
      description: "IoT device management & data collection"
    },
    {
      title: "Utility Management",
      href: "/utility-management",
      icon: Zap,
      description: "Energy monitoring & utility optimization"
    },
    {
      title: "Indirect Materials",
      href: "/indirect-materials",
      icon: Wrench,
      description: "Utilities & indirect materials"
    }
  ];

  const analyticsItems = [
    {
      title: "Analytics Dashboard",
      href: "/analytics",
      icon: BarChart3,
      description: "Reports & insights"
    },
    {
      title: "Advanced Analytics",
      href: "/advanced-analytics",
      icon: Brain,
      description: "AI-powered predictions & optimization"
    },
    {
      title: "Advanced Reporting",
      href: "/advanced-reporting",
      icon: Download,
      description: "Report generation & exports"
    },
    {
      title: "AI Report Generator",
      href: "/ai-report-generator",
      icon: Brain,
      description: "AI-powered intelligent reporting"
    },
    {
      title: "AI Credit Calculator",
      href: "/ai-credit-calculator",
      icon: Activity,
      description: "Enhanced credit calculation with AI"
    },
    {
      title: "Predictive Analytics",
      href: "/predictive-analytics",
      icon: Activity,
      description: "Predictive modeling & forecasting"
    }
  ];

  const certificationItems = [
    {
      title: "Certificate Management",
      href: "/certification",
      icon: Award,
      description: "ISCC+ certificates & compliance management"
    },
    {
      title: "Mass Balance Dashboard",
      href: "/mass-balance",
      icon: Scale,
      description: "Real-time IMBL monitoring & pool management"
    },
    {
      title: "Certificate Generator",
      href: "/certificate-generator",
      icon: Award,
      description: "Automated ISCC+ certificate generation"
    },
    {
      title: "ISA-95 Integration",
      href: "/isa95-integration",
      icon: Layers,
      description: "Automation pyramid integration & contract validation"
    },
    {
      title: "LLM API Settings",
      href: "/llm-settings",
      icon: Settings,
      description: "Configure AI providers and APIs"
    }
  ];

  const complianceItems = [
    {
      title: "Carbon Footprint",
      href: "/carbon",
      icon: Leaf,
      description: "Emissions & sustainability"
    },
    {
      title: "Environmental Monitoring",
      href: "/environmental-monitoring",
      icon: Cloud,
      description: "CEMS & emission monitoring"
    },
    {
      title: "Digital Product Passport",
      href: "/digital-product-passport",
      icon: Hash,
      description: "Product lifecycle transparency"
    }
  ];

  const allNavigationItems = [
    ...coreNavigationItems,
    ...managementItems,
    ...analyticsItems,
    ...certificationItems,
    ...complianceItems
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const DropdownMenu = ({ title, items, icon: Icon }: { title: string; items: any[]; icon: any }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setIsOpen(openDropdown === title);
    }, [openDropdown, title]);

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newState = openDropdown === title ? null : title;
      setOpenDropdown(newState);
    };

    return (
      <div className="relative">
        <Button
          variant={isOpen ? "default" : "ghost"}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            isOpen
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          onClick={handleClick}
        >
          <Icon className="h-4 w-4 mr-2" />
          {title}
          <ChevronDown className={`h-3 w-3 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="py-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(null);
                  }}
                  className={`flex items-center px-4 py-3 text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center w-full">
          <div className="flex items-center space-x-1">
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0 mr-6">
              <Database className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ISCC+ Manager</span>
            </Link>

            {coreNavigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
              </Link>
            ))}

            <DropdownMenu
              title="Management"
              items={managementItems}
              icon={Building}
            />

            <DropdownMenu
              title="Analytics"
              items={analyticsItems}
              icon={BarChart3}
            />

            <DropdownMenu
              title="ISCC+ Certification"
              items={certificationItems}
              icon={Award}
            />

            <DropdownMenu
              title="Compliance"
              items={complianceItems}
              icon={Leaf}
            />
          </div>
        </div>
      </nav>

      <nav className="hidden md:flex lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <Database className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">ISCC+ Manager</span>
          </Link>

          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            {coreNavigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{item.title}</span>
              </Link>
            ))}

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTabletMoreOpen(!isTabletMoreOpen);
                }}
                aria-label="More navigation options"
              >
                <MoreHorizontal className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>

              {isTabletMoreOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50" onClick={(e) => e.stopPropagation()}>
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Management
                    </div>
                    {managementItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsTabletMoreOpen(false)}
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.title}
                      </Link>
                    ))}

                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                      Analytics
                    </div>
                    {analyticsItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsTabletMoreOpen(false)}
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.title}
                      </Link>
                    ))}

                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                      ISCC+ Certification
                    </div>
                    {certificationItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsTabletMoreOpen(false)}
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.title}
                      </Link>
                    ))}

                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                      Compliance
                    </div>
                    {complianceItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsTabletMoreOpen(false)}
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <nav className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">ISCC+ Manager</span>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {isMobileMenuOpen && (
            <div className="mt-4 space-y-2">
              {allNavigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <div>
                    <div>{item.title}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;