import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Request bodies for the API docs (/api/docs). Documentation only: the
 * services read and validate the raw body themselves, so these classes
 * describe what they accept rather than enforce it.
 */

const UUID = '3f2b8c1e-5d4a-4f6b-9c2d-1a2b3c4d5e6f';

// ---------- Auth & account ----------

export class LoginBody {
  @ApiProperty({ enum: ['staff', 'parent'], example: 'staff' })
  role!: string;
  @ApiProperty({ example: 'admin@school.com' })
  email!: string;
  @ApiProperty({ example: 'secret-password' })
  password!: string;
}

export class RegisterBody {
  @ApiProperty({ description: 'School name', example: 'Northpoint College' })
  name!: string;
  @ApiProperty({ example: 'admin@northpoint.edu.ng' })
  email!: string;
  @ApiProperty({ example: 'secret-password' })
  password!: string;
}

export class ForgotPasswordBody {
  @ApiProperty({ example: 'parent@example.com' })
  email!: string;
  @ApiProperty({ enum: ['staff', 'parent'], example: 'parent' })
  role!: string;
}

export class SetPasswordBody {
  @ApiProperty({ description: 'Token from the emailed link' })
  token!: string;
  @ApiProperty({ minLength: 8, example: 'new-password-123' })
  password!: string;
}

export class StudentLoginBody {
  @ApiProperty({ example: 'NPR/SS/26/0001' })
  reg_number!: string;
  @ApiProperty({ description: '6 digits set by staff', example: '482913' })
  pin!: string;
}

export class StudentPinBody {
  @ApiProperty({
    nullable: true,
    description: '6 digits, or null to remove portal access',
    example: '482913',
  })
  pin!: string | null;
}

export class AccountUpdateBody {
  @ApiPropertyOptional({ example: 'Hauwa Umar' })
  name?: string;
  @ApiPropertyOptional({
    description: 'Any format; stored as E.164',
    example: '0803 333 4444',
  })
  contact?: string;
  @ApiPropertyOptional()
  alt_contact?: string;
  @ApiPropertyOptional()
  address?: string;
  @ApiPropertyOptional({ description: 'Image URL from the storage upload' })
  avatar?: string;
}

export class ChangePasswordBody {
  @ApiProperty()
  current_password!: string;
  @ApiProperty({ minLength: 8 })
  new_password!: string;
}

// ---------- People ----------

export class UserBody {
  @ApiProperty({ example: 'Isaac Dare' })
  name!: string;
  @ApiProperty({ example: 'isaac@school.com' })
  email!: string;
  @ApiPropertyOptional({
    enum: ['staff', 'parent'],
    description: 'Required on create; ignored on update',
  })
  role?: string;
  @ApiProperty({ enum: ['ADMINISTRATIVE', 'ACADEMIC', 'PARENT', 'GUARDIAN'] })
  position!: string;
  @ApiPropertyOptional({ example: '0803 333 4444' })
  contact?: string;
  @ApiPropertyOptional()
  alt_contact?: string;
  @ApiPropertyOptional()
  address?: string;
  @ApiPropertyOptional({ description: 'Image URL' })
  avatar?: string;
  @ApiPropertyOptional({
    description: 'Leave out on create to email a set-password invite instead',
  })
  password?: string;
  @ApiPropertyOptional({
    type: [Number],
    description: 'Face recognition descriptor',
  })
  face_descriptor?: number[];
}

export class NewParentBody {
  @ApiProperty({ example: 'Hauwa Musa' })
  name!: string;
  @ApiProperty({ example: 'hauwa@example.com' })
  email!: string;
  @ApiPropertyOptional({ example: '0803 333 4444' })
  contact?: string;
  @ApiPropertyOptional({ enum: ['PARENT', 'GUARDIAN'] })
  position?: string;
  @ApiPropertyOptional()
  address?: string;
}

export class StudentBody {
  @ApiProperty({ example: 'Amina Muhammad' })
  name!: string;
  @ApiPropertyOptional({
    example: 'NPR/SS/26/0012',
    description:
      'Leave empty on create to take the next number from the branch prefix',
  })
  reg_number?: string;
  @ApiPropertyOptional({
    example: UUID,
    nullable: true,
    description:
      'Parent account; leave out or null to add the student without one',
  })
  parent_uuid?: string | null;
  @ApiProperty({ example: UUID })
  class_uuid!: string;
  @ApiPropertyOptional({ enum: ['Male', 'Female'] })
  gender?: string;
  @ApiPropertyOptional({
    example: '2014-03-21',
    description: 'YYYY-MM-DD; empty clears it',
  })
  date_of_birth?: string;
  @ApiPropertyOptional({
    type: () => NewParentBody,
    description:
      'Create only: add a new parent with the student (instead of parent_uuid). They get the set-password invite.',
  })
  new_parent?: NewParentBody;
  @ApiPropertyOptional({ description: 'Image URL' })
  avatar?: string;
  @ApiPropertyOptional({
    enum: ['active', 'inactive'],
    description: 'Update only',
  })
  status?: string;
  @ApiPropertyOptional({ type: [Number] })
  face_descriptor?: number[];
}

export class ClassBody {
  @ApiProperty({ example: 'SS 1' })
  name!: string;
  @ApiPropertyOptional({ example: 30 })
  capacity?: number;
  @ApiPropertyOptional({
    description: 'Class teacher (user uuid)',
    example: UUID,
  })
  teacher_uuid?: string;
  @ApiPropertyOptional({
    type: [String],
    description: 'Other teachers (user uuids)',
  })
  teachers_uuid?: string[];
  @ApiPropertyOptional({
    enum: ['active', 'inactive'],
    description: 'Update only',
  })
  status?: string;
}

// ---------- School & branches ----------

export class BranchBody {
  @ApiProperty({ example: 'Victoria Island Campus' })
  name!: string;
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  contact?: string;
  @ApiPropertyOptional()
  address?: string;
  @ApiPropertyOptional({ description: 'Logo URL; heads report sheets' })
  avatar?: string;
  @ApiPropertyOptional({
    example: 'NPR/SS',
    description:
      'Registration number prefix; students become PREFIX/YY/0001. Empty to turn off. Update only',
  })
  reg_prefix?: string;
}

class ContentItem {
  @ApiPropertyOptional({ example: 'graduation-cap' })
  icon?: string;
  @ApiProperty()
  title!: string;
  @ApiProperty()
  description!: string;
}

class ThemeBody {
  @ApiProperty({ example: 'forest' })
  preset!: string;
  @ApiProperty({ example: '#166534' })
  primary!: string;
}

export class SchoolUpdateBody {
  @ApiPropertyOptional()
  name?: string;
  @ApiPropertyOptional({
    description: 'Public website address slug',
    example: 'northpoint',
  })
  slug?: string;
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  contact?: string;
  @ApiPropertyOptional()
  address?: string;
  @ApiPropertyOptional({ description: 'Logo URL' })
  avatar?: string;
  @ApiPropertyOptional({ description: 'Home page tagline' })
  subtext?: string;
  @ApiPropertyOptional({ description: 'HTML (sanitised)' })
  about?: string;
  @ApiPropertyOptional({ description: 'HTML (sanitised)' })
  mission?: string;
  @ApiPropertyOptional({ description: 'HTML (sanitised)' })
  vision?: string;
  @ApiPropertyOptional({
    type: [ContentItem],
    description: 'Why choose us (up to 8)',
  })
  features?: ContentItem[];
  @ApiPropertyOptional({
    type: [ContentItem],
    description: 'Our values (up to 8)',
  })
  values?: ContentItem[];
  @ApiPropertyOptional({
    type: ThemeBody,
    nullable: true,
    description: 'null resets to the default colours',
  })
  theme?: ThemeBody | null;
  @ApiPropertyOptional({
    description: 'false sends website visitors to the portal login',
  })
  website_enabled?: boolean;
}

// ---------- Billing & payments ----------

class FeeItem {
  @ApiProperty({ example: 'Tuition Fee (First Term)' })
  description!: string;
  @ApiProperty({ example: '100000', description: 'Naira, up to 2 decimals' })
  amount!: string;
  @ApiPropertyOptional({ example: 1, description: 'Invoices only' })
  quantity?: number;
}

export class TemplateBody {
  @ApiProperty({ example: 'JSS School Fees' })
  name!: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE'] })
  status?: string;
  @ApiProperty({ type: [FeeItem] })
  items!: FeeItem[];
}

export class InvoiceCreateBody {
  @ApiProperty({
    type: [String],
    description: 'One invoice per student',
    example: [UUID],
  })
  student_uuids!: string[];
  @ApiPropertyOptional({
    description: 'Copy items from a billing template',
    example: UUID,
  })
  template_uuid?: string;
  @ApiPropertyOptional({
    type: [FeeItem],
    description: 'Extra or custom items',
  })
  items?: FeeItem[];
  @ApiPropertyOptional({
    example: '3f2b8c1e-5d4a-4f6b-9c2d-1a2b3c4d5e6f',
    description:
      "Term billed (calendar uuid); defaults to the branch's active term",
  })
  calendar_uuid?: string;
  @ApiPropertyOptional({ example: '2026-12-01' })
  due_at?: string;
  @ApiPropertyOptional()
  note?: string;
}

export class InvoiceStatusBody {
  @ApiProperty({
    enum: ['PENDING', 'PART_PAYMENT', 'FULL_PAYMENT', 'CANCELLED', 'REFUNDED'],
  })
  status!: string;
  @ApiPropertyOptional({
    example: '20000',
    description: 'Required for part payments and refunds',
  })
  amount?: string;
  @ApiPropertyOptional({ example: 'Bank transfer, ref 1234' })
  description?: string;
}

export class PaymentSettingsBody {
  @ApiPropertyOptional()
  payments_enabled?: boolean;
  @ApiPropertyOptional({
    nullable: true,
    example: 'pk_live_xxxxxxxxxxxxxxxxxxxx',
  })
  paystack_public_key?: string | null;
  @ApiPropertyOptional({
    nullable: true,
    description:
      'Optional; leave out to keep, null to remove. Without it payments wait for staff to confirm',
  })
  paystack_secret_key?: string | null;
  @ApiPropertyOptional()
  allow_part_payment?: boolean;
  @ApiPropertyOptional({
    description: 'Add the Paystack fee to what parents pay',
  })
  parent_pays_fees?: boolean;
}

export class PaymentAmountBody {
  @ApiPropertyOptional({
    example: '20000',
    description: 'Leave out to pay the full balance',
  })
  amount?: string;
}

export class RejectPaymentBody {
  @ApiPropertyOptional({
    description: 'Shown to the parent',
    example: 'No matching payment in Paystack',
  })
  note?: string;
}

// ---------- Email ----------

class SmtpBody {
  @ApiProperty({ example: 'smtp.gmail.com' })
  host!: string;
  @ApiProperty({ example: 587 })
  port!: number;
  @ApiProperty({ enum: ['ssl', 'starttls', 'none'] })
  security!: string;
  @ApiPropertyOptional()
  username?: string;
  @ApiPropertyOptional({
    description: "Leave out to keep the saved one, '' to remove",
  })
  password?: string;
  @ApiPropertyOptional({ example: 'School office' })
  from_name?: string;
  @ApiProperty({ example: 'office@school.com' })
  from_email!: string;
  @ApiPropertyOptional()
  reply_to?: string;
}

export class EmailSettingsBody {
  @ApiPropertyOptional()
  email_enabled?: boolean;
  @ApiPropertyOptional({
    type: SmtpBody,
    nullable: true,
    description: 'null falls back to platform email',
  })
  smtp?: SmtpBody | null;
  @ApiPropertyOptional({
    description: 'Category on/off, e.g. { "invoices": true, "events": false }',
    example: { invoices: true, events: false },
  })
  types?: Record<string, boolean>;
}

export class TestEmailBody {
  @ApiPropertyOptional({
    description: 'Defaults to your own email',
    example: 'you@school.com',
  })
  to?: string;
}

// ---------- Import ----------

export class ImportBody {
  @ApiProperty({
    description:
      'Spreadsheet rows keyed by column (header names or keys), at most 2000',
    example: [
      {
        name: 'Amina Muhammad',
        class: 'JSS 1',
        parent_email: 'hauwa@example.com',
        parent_name: 'Hauwa Muhammad',
      },
    ],
  })
  rows!: Record<string, string>[];
  @ApiPropertyOptional({
    default: true,
    description: 'true (default) only checks the rows; false saves them',
  })
  dry_run?: boolean;
  @ApiPropertyOptional({
    description: 'Results only: the term the scores are for',
  })
  calendar_uuid?: string;
}
