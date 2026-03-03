import { Link } from "react-router";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";

type BreadcrumbItemType = {
  path?: string; // optional path, if undefined means no link (current page)
  label: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItemType[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  {item.path && !isLast ? (
                    <Link title={item.label} to={item.path}>
                      {item.label}
                    </Link>
                  ) : (
                    // For last item or no path, render plain label
                    <span aria-current={isLast ? "page" : undefined}>
                      {item.label}
                    </span>
                  )}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </nav>
  );
};

export default Breadcrumb;
