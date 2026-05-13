import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Briefcase,
  Building,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  MapPin,
  MoreVertical,
  Plus,
  Receipt,
  Search,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react'
import './App.css'

const OWNERS_DB = {
  own_1: { name: 'Rivera Holdings LLC', type: 'Corporate' },
  own_2: { name: 'Sarah Jenkins (Individual)', type: 'Individual' },
}

const PROPERTIES_DB = [
  {
    id: 'p_1',
    name: 'Sunset Heights',
    address: '123 Solar Way, Austin, TX 78701',
    ownerId: 'own_1',
    totalUnits: 24,
    occupancyRate: 95,
    yearBuilt: 2018,
    type: 'Multi-Family',
  },
  {
    id: 'p_2',
    name: 'The Meridian',
    address: '880 Skyline Blvd, Austin, TX 78702',
    ownerId: 'own_1',
    totalUnits: 12,
    occupancyRate: 100,
    yearBuilt: 2021,
    type: 'Multi-Family',
  },
  {
    id: 'p_3',
    name: 'Parkside Duplex',
    address: '990 Park Ave, Dallas, TX 75001',
    ownerId: 'own_2',
    totalUnits: 2,
    occupancyRate: 50,
    yearBuilt: 1995,
    type: 'Duplex',
  },
]

const RENT_ROLL_DB = {
  p_1: [
    {
      unit: '1A',
      tenant: 'Alex Rivera',
      leaseStart: 'Jan 01, 2026',
      leaseEnd: 'Dec 31, 2026',
      rent: 2450.0,
      status: 'paid',
    },
    {
      unit: '1B',
      tenant: 'Marcus Chen',
      leaseStart: 'Mar 15, 2025',
      leaseEnd: 'Mar 14, 2027',
      rent: 2500.0,
      status: 'pending',
    },
    {
      unit: '2A',
      tenant: 'Sarah Jenkins',
      leaseStart: 'Jun 01, 2026',
      leaseEnd: 'May 31, 2027',
      rent: 2450.0,
      status: 'paid',
    },
    {
      unit: '2B',
      tenant: null,
      leaseStart: null,
      leaseEnd: null,
      rent: 2600.0,
      status: 'vacant',
    },
  ],
  p_2: [
    {
      unit: '101',
      tenant: 'David Miller',
      leaseStart: 'Feb 01, 2026',
      leaseEnd: 'Jan 31, 2027',
      rent: 3100.0,
      status: 'paid',
    },
    {
      unit: '102',
      tenant: 'Emma Wilson',
      leaseStart: 'Aug 01, 2025',
      leaseEnd: 'Jul 31, 2026',
      rent: 2950.0,
      status: 'overdue',
    },
  ],
  p_3: [
    {
      unit: 'A',
      tenant: 'James Cooper',
      leaseStart: 'Sep 01, 2025',
      leaseEnd: 'Aug 31, 2026',
      rent: 1800.0,
      status: 'paid',
    },
    {
      unit: 'B',
      tenant: null,
      leaseStart: null,
      leaseEnd: null,
      rent: 1800.0,
      status: 'vacant',
    },
  ],
}

const STATUS_META = {
  paid: { label: 'Paid', className: 'status status-paid', icon: CheckCircle2 },
  pending: { label: 'Pending', className: 'status status-pending', icon: Clock },
  overdue: { label: 'Overdue', className: 'status status-overdue', icon: AlertCircle },
  vacant: { label: 'Vacant', className: 'status status-vacant' },
}

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

function StatusTag({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.vacant
  const Icon = meta.icon

  return (
    <span className={meta.className}>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {meta.label}
    </span>
  )
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPropId, setSelectedPropId] = useState(PROPERTIES_DB[0]?.id ?? null)

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return PROPERTIES_DB
    }

    return PROPERTIES_DB.filter(
      (property) =>
        property.name.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const selectedProperty =
    filteredProperties.find((property) => property.id === selectedPropId) ??
    filteredProperties[0]
  const propertyOwner = selectedProperty ? OWNERS_DB[selectedProperty.ownerId] : null
  const rentRoll = selectedProperty ? RENT_ROLL_DB[selectedProperty.id] ?? [] : []

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <span>
            Property<span className="brand-accent">HQ</span>
          </span>
        </div>

        <div className="sidebar-label">Databases</div>
        <nav className="sidebar-nav">
          {[
            { id: 'properties', icon: Building2, label: 'Properties', active: true },
            { id: 'owners', icon: Briefcase, label: 'Property Owners' },
            { id: 'tenants', icon: Users, label: 'Tenants' },
          ].map((tab) => (
            <button key={tab.id} type="button" className={`nav-item ${tab.active ? 'active' : ''}`}>
              <tab.icon size={16} aria-hidden="true" />
              {tab.label}
            </button>
          ))}

          <div className="sidebar-label section-gap">Operations</div>
          {[
            { id: 'accounting', icon: Receipt, label: 'Accounting & Ledger' },
            { id: 'maintenance', icon: Wrench, label: 'Maintenance HQ' },
            { id: 'reports', icon: FileText, label: 'Reports' },
          ].map((tab) => (
            <button key={tab.id} type="button" className="nav-item">
              <tab.icon size={16} aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content-shell">
        <header className="top-bar">
          <h1>Property Database</h1>

          <div className="top-actions">
            <label className="search-wrap">
              <Search size={16} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search properties or addresses..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search properties"
              />
            </label>
            <button type="button" className="primary-btn">
              <Plus size={16} aria-hidden="true" /> Add Property
            </button>
          </div>
        </header>

        <div className="master-detail">
          <section className="master-list" aria-label="Properties list">
            <div className="list-header">
              <span>{filteredProperties.length} Properties</span>
              <button type="button" aria-label="Property list options" className="icon-btn">
                <MoreVertical size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="list-items">
              {filteredProperties.length ? (
                filteredProperties.map((property) => (
                  <button
                    type="button"
                    key={property.id}
                    onClick={() => setSelectedPropId(property.id)}
                    className={`property-item ${selectedPropId === property.id ? 'selected' : ''}`}
                  >
                    <div className="property-item-top">
                      <h3>{property.name}</h3>
                      <span>{property.totalUnits} Units</span>
                    </div>
                    <p>{property.address}</p>
                    <div className="occupancy-track" aria-hidden="true">
                      <div
                        className="occupancy-fill"
                        style={{ width: `${property.occupancyRate}%` }}
                      />
                    </div>
                  </button>
                ))
              ) : (
                <div className="empty-state">No properties matched your search.</div>
              )}
            </div>
          </section>

          <section className="detail-panel" aria-label="Property details">
            {selectedProperty ? (
              <div className="detail-content">
                <div className="detail-header">
                  <div className="property-header">
                    <div className="building-icon">
                      <Building size={26} aria-hidden="true" />
                    </div>
                    <div>
                      <h2>{selectedProperty.name}</h2>
                      <div className="property-meta">
                        <span>
                          <MapPin size={14} aria-hidden="true" /> {selectedProperty.address}
                        </span>
                        <span>{selectedProperty.type}</span>
                        <span>Built {selectedProperty.yearBuilt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="owner-card">
                    <Briefcase size={16} aria-hidden="true" />
                    <div>
                      <p>Linked Owner</p>
                      <button type="button" className="owner-link">
                        {propertyOwner?.name ?? 'Unknown owner'}
                        <ExternalLink size={12} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                <section>
                  <h3 className="section-title">Accounting Quick Links</h3>
                  <div className="quick-links">
                    <button type="button" className="quick-link-btn">
                      <Wallet size={18} aria-hidden="true" />
                      <div>
                        <strong>Record Offline Rent</strong>
                        <span>Log cash/check payments</span>
                      </div>
                    </button>
                    <button type="button" className="quick-link-btn">
                      <DollarSign size={18} aria-hidden="true" />
                      <div>
                        <strong>Pay Bills / Expenses</strong>
                        <span>Pay contractors for this property</span>
                      </div>
                    </button>
                    <button type="button" className="quick-link-btn">
                      <FileSpreadsheet size={18} aria-hidden="true" />
                      <div>
                        <strong>Property Ledger</strong>
                        <span>View full P&amp;L statement</span>
                      </div>
                    </button>
                  </div>
                </section>

                <section>
                  <div className="rent-roll-head">
                    <div>
                      <h3>Current Rent Roll</h3>
                      <p>
                        {selectedProperty.totalUnits} Total Units • {selectedProperty.occupancyRate}%
                        Occupied
                      </p>
                    </div>
                    <button type="button" className="secondary-btn">
                      <FileText size={16} aria-hidden="true" /> Export CSV
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Unit</th>
                          <th>Tenant / Lessee</th>
                          <th>Lease Term</th>
                          <th className="align-right">Mo. Rent</th>
                          <th className="align-center">Status</th>
                          <th aria-label="actions" />
                        </tr>
                      </thead>
                      <tbody>
                        {rentRoll.map((lease) => (
                          <tr key={lease.unit}>
                            <td className="strong">{lease.unit}</td>
                            <td>
                              {lease.tenant ? (
                                <button type="button" className="tenant-link">
                                  {lease.tenant}
                                </button>
                              ) : (
                                <span className="muted">Vacant</span>
                              )}
                            </td>
                            <td>
                              {lease.leaseStart ? (
                                `${lease.leaseStart} - ${lease.leaseEnd}`
                              ) : (
                                <span className="muted">—</span>
                              )}
                            </td>
                            <td className="align-right strong">{formatCurrency(lease.rent)}</td>
                            <td className="align-center">
                              <StatusTag status={lease.status} />
                            </td>
                            <td className="align-right">
                              {lease.tenant ? (
                                <button
                                  type="button"
                                  className="icon-btn"
                                  aria-label={`Open actions for unit ${lease.unit}`}
                                >
                                  <MoreVertical size={16} aria-hidden="true" />
                                </button>
                              ) : (
                                <button type="button" className="small-action-btn">
                                  Add Lease
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            ) : (
              <div className="detail-empty">
                <Building size={48} aria-hidden="true" />
                <p>Select a property to view its database</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
