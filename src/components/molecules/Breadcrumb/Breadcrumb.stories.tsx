import { Meta, StoryObj } from "@storybook/react"
import  BreadcrumbComponent from "./index"

const meta: Meta<typeof BreadcrumbComponent> = {
  title: "Components/BreadcrumbComponent",
  component: BreadcrumbComponent,
  argTypes: {
    items: {
      description: "Array of breadcrumb items with `label` and optional `href`",
    },
  },
}

export default meta

type Story = StoryObj<typeof BreadcrumbComponent>

// Default Story: 3 items, no dropdown needed
export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Documentation", href: "/docs" },
      { label: "Breadcrumb" },
    ],
  },
}

// Story with 5 items: Dropdown menu for middle items
export const WithDropdown: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Documentation", href: "/docs" },
      { label: "Themes", href: "/themes" },
      { label: "GitHub", href: "/github" },
      { label: "Breadcrumb" },
    ],
  },
}

// Story with 6 items: Demonstrates additional items in dropdown
export const LargeBreadcrumb: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Documentation", href: "/docs" },
      { label: "Themes", href: "/themes" },
      { label: "GitHub", href: "/github" },
      { label: "Components", href: "/docs/components" },
      { label: "Breadcrumb" },
    ],
  },
}
