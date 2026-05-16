import {
  BookMarked,
  BookOpenIcon,
  BookOpenTextIcon,
  CalendarCheck2Icon,
  CalendarClockIcon,
  CalendarIcon,
  CalendarOffIcon,
  Clock2Icon,
  FolderOpenIcon,
  LayoutTemplateIcon,
  MailsIcon,
  MailWarningIcon,
  Settings2Icon,
  Users2Icon,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { NavLink } from "react-router";
import { Card, CardContent } from "../../ui/card";
import { createAppointmentsLiveTile } from "./AppointmentsLiveTile";
import { createCourseEnrollmentsLiveTile } from "./CourseEnrollmentsLiveTile";
import { type BaseTileProps } from "./LiveTile";
import { createEmailsLiveTile } from "./EmailsLiveTile";

export type MenuLink =
  | {
      type: "link";
      name: string;
      path: string;
      title: string;
      icon: LucideIcon;
    }
  | {
      type: "live";
      name: string;
      path: string;
      title: string;
      icon: LucideIcon;
      component: ComponentType<BaseTileProps>;
    };

export interface MenuSection {
  module: string;
  links: MenuLink[];
}

const menuItems: MenuSection[] = [
  {
    module: "Appointments",
    links: [
      {
        type: "live",
        name: "New",
        path: "/appointments/pending",
        title: "View new appointments",
        icon: CalendarClockIcon,
        component: createAppointmentsLiveTile({ status: "pending" }),
      },
      {
        type: "live",
        name: "Today",
        path: "/appointments/confirmed?day=today",
        title: "View confirmed appointments for today",
        icon: CalendarCheck2Icon,
        component: createAppointmentsLiveTile({
          status: "confirmed",
          today: true,
        }),
      },
      {
        type: "live",
        name: "Tomorrow",
        path: "/appointments/confirmed?day=tomorrow",
        title: "View confirmed appointments for tomorrow",
        icon: CalendarCheck2Icon,
        component: createAppointmentsLiveTile({
          status: "confirmed",
          tomorrow: true,
        }),
      },
      {
        type: "link",
        name: "All",
        path: "/appointments",
        title: "View all appointments",
        icon: CalendarIcon,
      },
    ],
  },
  {
    module: "Courses & Enrollments",
    links: [
      {
        type: "link",
        name: "Courses",
        path: "/courses",
        title: "View all courses",
        icon: BookOpenTextIcon,
      },
      {
        type: "live",
        name: "Confirmed enrollments",
        path: "/enrollments/confirmed",
        title: "View confirmed course enrollments",
        icon: BookOpenIcon,
        component: createCourseEnrollmentsLiveTile(),
      },
      {
        type: "link",
        name: "All enrollments",
        path: "/enrollments",
        title: "View all course enrollments",
        icon: BookMarked,
      },
    ],
  },
  {
    module: "Mailing",
    links: [
      {
        type: "link",
        name: "Emails",
        path: "/emails",
        title: "View all emails",
        icon: MailsIcon,
      },
      {
        type: "live",
        name: "Errors",
        path: "/emails?error=true",
        title: "View all email errors",
        icon: MailWarningIcon,
        component: createEmailsLiveTile({ error: true }),
      },
      {
        type: "link",
        name: "Templates",
        path: "/email-templates",
        title: "View all email templates",
        icon: LayoutTemplateIcon,
      },
    ],
  },
  {
    module: "Configuration",
    links: [
      {
        type: "link",
        name: "Business hours",
        path: "/business-hours",
        title: "View all business hours",
        icon: Clock2Icon,
      },
      {
        type: "link",
        name: "Free days",
        path: "/free-days",
        title: "View all free days",
        icon: CalendarOffIcon,
      },
      {
        type: "link",
        name: "Categories",
        path: "/categories",
        title: "View all service categories",
        icon: FolderOpenIcon,
      },
      {
        type: "link",
        name: "Services",
        path: "/services",
        title: "View all services",
        icon: Settings2Icon,
      },
      {
        type: "link",
        name: "Users",
        path: "/users",
        title: "View all users",
        icon: Users2Icon,
      },
    ],
  },
];

const GridMenu = () => {
  return (
    <div className="space-y-4 flex flex-col md:flex-row justify-start items-center md:items-start gap-2 md:gap-4 flex-wrap">
      {menuItems.map((section, i) => (
        <Card className="" key={i}>
          <CardContent>
            {/* Section Title */}
            <h2 className="text-lg font-semibold text-foreground/70 mb-4">
              {section.module}
            </h2>

            {/* Grid of Links */}
            <div className="flex flex-col items-center lg:items-start justify-center space-y-8">
              <div className="grid grid-cols-2 gap-5">
                {section.links.map((link) => {
                  if (link.type === "live") {
                    const LiveComponent = link.component;

                    return (
                      <LiveComponent
                        key={link.name}
                        name={link.name}
                        path={link.path}
                        title={link.title}
                        icon={link.icon}
                      />
                    );
                  }

                  return (
                    <NavLink
                      key={link.name}
                      title={link.title}
                      to={link.path}
                      className="group"
                    >
                      <Card className="w-32 sm:w-36 h-32 flex flex-col items-center justify-center rounded-2xl border hover:shadow-lg hover:border-primary/50 transition-all">
                        <CardContent className="flex flex-col items-center space-y-2 p-3">
                          <link.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium text-center group-hover:text-primary">
                            {link.name}
                          </span>
                        </CardContent>
                      </Card>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GridMenu;
