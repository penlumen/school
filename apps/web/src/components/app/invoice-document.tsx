import type {InvoiceDetail} from '@/hooks/billing';
import {INVOICE_STATUS_LABEL, naira, toNumber} from '@/hooks/billing';
import {cn} from '@/lib/utils';

const formatDate = (value: string | null) =>
    value
        ? new Date(value).toLocaleDateString('en-GB', {timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric'})
        : '—';

const initials = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/** The printable A4 invoice, laid out as in the Figma "School 1 invoice" frame. */
export function InvoiceDocument({invoice, className}: { invoice: InvoiceDetail; className?: string }) {
    const school = invoice.branch.school;
    const fromName = school.name === invoice.branch.name ? school.name : `${school.name}, ${invoice.branch.name}`;
    const fromAddress = invoice.branch.address || school.address;
    const fromPhone = invoice.branch.contact || school.contact;
    const fromEmail = invoice.branch.email || school.email;
    const logo = school.avatar || invoice.branch.avatar;
    const parent = invoice.student.parent;

    const subtotal = invoice.items.reduce((sum, item) => sum + toNumber(item.amount) * item.quantity, 0);
    const paid = toNumber(invoice.paid);
    const due = invoice.status === 'CANCELLED' ? 0 : Math.max(0, toNumber(invoice.total) - paid);

    return (
        <article
            className={cn(
                'invoice-document mx-auto flex aspect-[210/297] w-full max-w-[794px] flex-col bg-[#f9f9fc] p-[6%] text-[13px] text-[#212121] shadow-[0_4px_30px_rgba(46,45,116,0.1)] print:max-w-none print:shadow-none',
                className,
            )}
        >
            <header className='flex items-start justify-between'>
                <div>
                    <h1 className='text-4xl font-semibold tracking-[-0.03em] text-black'>INVOICE</h1>
                    <p className='mt-1 tracking-wide text-[#505050]'>#{invoice.number}</p>
                </div>
                <div className='flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-[#e6ebf3] text-xl font-medium text-[#003378]'>
                    {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logo} alt='' className='h-full w-full object-contain'/>
                    ) : (
                        initials(school.name)
                    )}
                </div>
            </header>

            <section className='mt-8 grid grid-cols-3 border-y border-[#e7e7e7]'>
                <div className='space-y-5 py-5 pr-4'>
                    <div>
                        <p className='font-medium'>Issued</p>
                        <p className='mt-2 font-medium text-[#003884]'>{formatDate(invoice.issued_at)}</p>
                    </div>
                    <div>
                        <p className='font-medium'>Due</p>
                        <p className='mt-2 font-medium text-[#003884]'>{formatDate(invoice.due_at)}</p>
                    </div>
                </div>
                <div className='border-x border-[#e7e7e7] px-4 py-5'>
                    <p className='font-medium'>Billed to</p>
                    <p className='mt-2 font-medium text-[#003884]'>{parent?.name || 'Parent / guardian'}</p>
                    <div className='mt-1 space-y-0.5 text-[#6c6c6c]'>
                        {parent?.address && <p>{parent.address}</p>}
                        {parent?.contact && <p>{parent.contact}</p>}
                        <p>
                            For {invoice.student.name}
                            {invoice.student.class ? ` · ${invoice.student.class.name}` : ''}
                        </p>
                    </div>
                </div>
                <div className='py-5 pl-4'>
                    <p className='font-medium'>From</p>
                    <p className='mt-2 font-medium text-[#003884]'>{fromName}</p>
                    {fromAddress && <p className='mt-1 text-[#6c6c6c]'>{fromAddress}</p>}
                </div>
            </section>

            <table className='mt-10 w-full border-collapse'>
                <thead>
                    <tr className='border-b border-[#e7e7e7] text-left'>
                        <th className='pb-3 font-medium'>Description</th>
                        <th className='w-16 pb-3 font-medium'>Qty</th>
                        <th className='w-28 pb-3 text-right font-medium'>Amount</th>
                        <th className='w-28 pb-3 text-right font-medium'>Line total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item) => (
                        <tr key={item.uuid}>
                            <td className='pt-4'>{item.description}</td>
                            <td className='pt-4 text-[#505050]'>{item.quantity}</td>
                            <td className='pt-4 text-right text-[#505050]'>{naira(item.amount)}</td>
                            <td className='pt-4 text-right'>{naira(toNumber(item.amount) * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='mt-6 flex justify-end border-t border-[#e7e7e7] pt-1'>
                <dl className='w-1/2'>
                    {[
                        ['Subtotal', naira(subtotal)],
                        ['Tax (0%)', naira(0)],
                        ['Total', naira(invoice.total)],
                        ...(paid > 0 ? [['Paid', `− ${naira(paid)}`]] : []),
                    ].map(([label, value]) => (
                        <div key={label} className='flex justify-between border-b border-[#e7e7e7] py-3'>
                            <dt className='font-medium'>{label}</dt>
                            <dd className='font-medium'>{value}</dd>
                        </div>
                    ))}
                    <div className='flex justify-between border-y-2 border-[#003884] py-3 font-semibold text-[#003884]'>
                        <dt>Amount due</dt>
                        <dd>{naira(due)}</dd>
                    </div>
                    {invoice.status !== 'PENDING' && (
                        <p className='mt-2 text-right text-xs uppercase tracking-wide text-[#6c6c6c]'>
                            Status: {INVOICE_STATUS_LABEL[invoice.status]}
                        </p>
                    )}
                </dl>
            </div>

            <footer className='mt-auto'>
                <p className='font-medium'>Thank you for contributing towards your ward&apos;s future.</p>
                <p className='mt-2 text-[#6c6c6c]'>
                    {invoice.note || (invoice.due_at ? `Please pay by ${formatDate(invoice.due_at)}.` : 'Please pay at your earliest convenience.')}
                </p>
                <div className='mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#e7e7e7] pt-5 text-[#505050]'>
                    <span>{fromName}</span>
                    <span className='flex items-center gap-4'>
                        {fromPhone && <span>{fromPhone}</span>}
                        {fromPhone && fromEmail && <span className='h-4 w-px bg-[#e7e7e7]'/>}
                        {fromEmail && <span>{fromEmail}</span>}
                    </span>
                </div>
            </footer>
        </article>
    );
}
