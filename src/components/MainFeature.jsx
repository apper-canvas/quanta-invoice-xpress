import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Icons
const PlusIcon = getIcon('Plus');
const TrashIcon = getIcon('Trash2');
const SaveIcon = getIcon('Save');
const CopyIcon = getIcon('Copy');
const CalendarIcon = getIcon('Calendar');
const DollarSignIcon = getIcon('DollarSign');
const CheckIcon = getIcon('Check');
const XIcon = getIcon('X');
const SearchIcon = getIcon('Search');
const FilterIcon = getIcon('Filter');
const RefreshCcwIcon = getIcon('RefreshCcw');

const MainFeature = () => {
  // Invoice list state
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved invoices", e);
        return initialInvoices;
      }
    }
    return initialInvoices;
  });
  
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formMode, setFormMode] = useState(null); // 'create', 'edit', or null
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Form state
  const [invoiceForm, setInvoiceForm] = useState({
    clientName: '',
    invoiceNumber: '',
    issueDate: formatDate(new Date()),
    dueDate: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // +30 days
    status: 'draft',
    items: [{ description: '', quantity: 1, price: 0 }],
    notes: ''
  });
  
  // Save to localStorage whenever invoices change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);
  
  // Filter and search invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Calculate total for invoice
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2);
  };
  
  // Format date YYYY-MM-DD
  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    
    return [year, month, day].join('-');
  }
  
  // Generate a random invoice number
  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };
  
  // Reset the form
  const resetForm = () => {
    setInvoiceForm({
      clientName: '',
      invoiceNumber: generateInvoiceNumber(),
      issueDate: formatDate(new Date()),
      dueDate: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      status: 'draft',
      items: [{ description: '', quantity: 1, price: 0 }],
      notes: ''
    });
  };
  
  // Handle new invoice creation
  const handleCreateInvoice = () => {
    resetForm();
    setFormMode('create');
  };
  
  // Handle editing an invoice
  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice.id);
    setInvoiceForm({
      ...invoice,
    });
    setFormMode('edit');
  };
  
  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setInvoiceForm({
      ...invoiceForm,
      [name]: value
    });
  };
  
  // Handle line item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceForm.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'price' || field === 'quantity' ? parseFloat(value) || 0 : value
    };
    
    setInvoiceForm({
      ...invoiceForm,
      items: updatedItems
    });
  };
  
  // Add a new line item
  const handleAddItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { description: '', quantity: 1, price: 0 }]
    });
  };
  
  // Remove a line item
  const handleRemoveItem = (index) => {
    if (invoiceForm.items.length > 1) {
      const updatedItems = [...invoiceForm.items];
      updatedItems.splice(index, 1);
      setInvoiceForm({
        ...invoiceForm,
        items: updatedItems
      });
    } else {
      toast.warning("Invoice needs at least one item");
    }
  };
  
  // Handle form submission
  const handleSubmitInvoice = (e) => {
    e.preventDefault();
    
    if (!invoiceForm.clientName) {
      toast.error("Client name is required");
      return;
    }
    
    if (invoiceForm.items.some(item => !item.description)) {
      toast.error("All items must have a description");
      return;
    }
    
    if (formMode === 'create') {
      const newInvoice = {
        ...invoiceForm,
        id: Date.now().toString(),
        invoiceNumber: invoiceForm.invoiceNumber || generateInvoiceNumber(),
        createdAt: new Date().toISOString()
      };
      
      setInvoices([newInvoice, ...invoices]);
      toast.success("New invoice created successfully!");
    } else if (formMode === 'edit') {
      const updatedInvoices = invoices.map(invoice => 
        invoice.id === selectedInvoice ? { ...invoiceForm, updatedAt: new Date().toISOString() } : invoice
      );
      setInvoices(updatedInvoices);
      toast.success("Invoice updated successfully!");
    }
    
    setFormMode(null);
    resetForm();
  };
  
  // Cancel form editing
  const handleCancelForm = () => {
    setFormMode(null);
    setSelectedInvoice(null);
  };
  
  // Delete an invoice
  const handleDeleteInvoice = (id) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
      setInvoices(updatedInvoices);
      toast.success("Invoice deleted successfully!");
    }
  };
  
  // Clone an invoice
  const handleCloneInvoice = (invoice) => {
    const clonedInvoice = {
      ...invoice,
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber(),
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    setInvoices([clonedInvoice, ...invoices]);
    toast.success("Invoice cloned successfully!");
  };
  
  // Mark invoice as paid
  const handleMarkPaid = (id) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status: 'paid', updatedAt: new Date().toISOString() } : invoice
    );
    setInvoices(updatedInvoices);
    toast.success("Invoice marked as paid!");
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Invoice List */}
        <div className={`${formMode ? 'hidden md:block' : 'block'} md:col-span-${formMode ? '1' : '3'}`}>
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="text-xl font-bold mb-4 sm:mb-0">Invoice Management</h2>
              <motion.button
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary text-white font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateInvoice}
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Invoice</span>
              </motion.button>
            </div>
            
            <div className="mb-6 space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-5 w-5" />
                  <select
                    className="input-field pl-10 pr-8 appearance-none bg-right bg-no-repeat"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em" }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Invoice List */}
            {filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                  {/* Mobile View (Cards) */}
                  <div className="md:hidden space-y-4">
                    {filteredInvoices.map(invoice => (
                      <motion.div 
                        key={invoice.id}
                        className="card-neu p-4"
                        whileHover={{ y: -2, boxShadow: '0 6px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{invoice.clientName}</h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">{invoice.invoiceNumber}</p>
                          </div>
                          <StatusBadge status={invoice.status} />
                        </div>
                        
                        <div className="flex justify-between items-center mt-3">
                          <div>
                            <p className="text-lg font-bold">${calculateTotal(invoice.items)}</p>
                            <p className="text-xs text-surface-500 dark:text-surface-400">Due: {invoice.dueDate}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditInvoice(invoice)}
                              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                            >
                              <SaveIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleCloneInvoice(invoice)} 
                              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                            >
                              <CopyIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 text-red-600 dark:text-red-400 transition-colors"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Desktop View (Table) */}
                  <table className="hidden md:table min-w-full">
                    <thead className="bg-surface-50 dark:bg-surface-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Invoice #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                      {filteredInvoices.map(invoice => (
                        <tr 
                          key={invoice.id} 
                          className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{invoice.clientName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500 dark:text-surface-400">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>{invoice.issueDate}</div>
                            <div className="text-xs text-surface-500 dark:text-surface-400">Due: {invoice.dueDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={invoice.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                            ${calculateTotal(invoice.items)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end gap-2">
                              {invoice.status !== 'paid' && (
                                <button 
                                  onClick={() => handleMarkPaid(invoice.id)}
                                  className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 text-green-600 dark:text-green-400 transition-colors"
                                  title="Mark as Paid"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => handleEditInvoice(invoice)}
                                className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-400 transition-colors"
                                title="Edit Invoice"
                              >
                                <SaveIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleCloneInvoice(invoice)}
                                className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/40 text-purple-600 dark:text-purple-400 transition-colors"
                                title="Clone Invoice"
                              >
                                <CopyIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 text-red-600 dark:text-red-400 transition-colors"
                                title="Delete Invoice"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <RefreshCcwIcon className="h-12 w-12 mx-auto text-surface-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No invoices found</h3>
                <p className="text-surface-500 dark:text-surface-400 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Try adjusting your search or filters" 
                    : "Create your first invoice to get started"}
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <button
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                  >
                    <RefreshCcwIcon className="h-4 w-4 mr-2" />
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Invoice Form */}
        <AnimatePresence>
          {formMode && (
            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card p-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {formMode === 'create' ? 'Create New Invoice' : 'Edit Invoice'}
                  </h2>
                  <button 
                    onClick={handleCancelForm}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmitInvoice} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="clientName">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        className="input-field"
                        value={invoiceForm.clientName}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="invoiceNumber">
                        Invoice Number
                      </label>
                      <input
                        type="text"
                        id="invoiceNumber"
                        name="invoiceNumber"
                        className="input-field"
                        value={invoiceForm.invoiceNumber || generateInvoiceNumber()}
                        onChange={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="issueDate">
                        Issue Date
                      </label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-5 w-5" />
                        <input
                          type="date"
                          id="issueDate"
                          name="issueDate"
                          className="input-field pl-10"
                          value={invoiceForm.issueDate}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="dueDate">
                        Due Date
                      </label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-5 w-5" />
                        <input
                          type="date"
                          id="dueDate"
                          name="dueDate"
                          className="input-field pl-10"
                          value={invoiceForm.dueDate}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2" htmlFor="status">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="input-field"
                        value={invoiceForm.status}
                        onChange={handleFormChange}
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Line Items */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Invoice Items</h3>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="flex items-center text-sm font-medium text-primary"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Item
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Header (desktop only) */}
                      <div className="hidden md:grid md:grid-cols-12 gap-4 text-sm font-medium text-surface-500 dark:text-surface-400">
                        <div className="md:col-span-6">Description</div>
                        <div className="md:col-span-2">Quantity</div>
                        <div className="md:col-span-3">Price</div>
                        <div className="md:col-span-1"></div>
                      </div>
                      
                      {/* Line Items */}
                      {invoiceForm.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                          <div className="md:col-span-6">
                            <label className="block md:hidden text-sm font-medium mb-1">Description</label>
                            <input
                              type="text"
                              className="input-field"
                              placeholder="Item description"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block md:hidden text-sm font-medium mb-1">Quantity</label>
                            <input
                              type="number"
                              className="input-field"
                              min="1"
                              step="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="md:col-span-3">
                            <label className="block md:hidden text-sm font-medium mb-1">Price</label>
                            <div className="relative">
                              <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-4 w-4" />
                              <input
                                type="number"
                                className="input-field pl-8"
                                min="0"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end md:col-span-1">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              disabled={invoiceForm.items.length <= 1}
                              title="Remove Item"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Invoice Total */}
                      <div className="flex justify-end pt-4 border-t border-surface-200 dark:border-surface-700">
                        <div className="text-right">
                          <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Invoice Total</p>
                          <p className="text-2xl font-bold">${calculateTotal(invoiceForm.items)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="notes">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="input-field"
                      placeholder="Additional notes for the client..."
                      value={invoiceForm.notes}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <motion.button
                      type="button"
                      className="btn btn-outline"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancelForm}
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      type="submit"
                      className="btn btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {formMode === 'create' ? 'Create Invoice' : 'Update Invoice'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-700 dark:text-blue-400' },
    pending: { bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', textColor: 'text-yellow-700 dark:text-yellow-400' },
    paid: { bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-700 dark:text-green-400' },
    overdue: { bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-700 dark:text-red-400' }
  };
  
  const config = statusConfig[status] || statusConfig.draft;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Sample initial invoices data
const initialInvoices = [
  {
    id: '1',
    clientName: 'Acme Corporation',
    invoiceNumber: 'INV-2023-001',
    issueDate: '2023-09-15',
    dueDate: '2023-10-15',
    status: 'paid',
    items: [
      { description: 'Web Development Services', quantity: 1, price: 1500 },
      { description: 'Hosting (Annual)', quantity: 1, price: 200 }
    ],
    notes: 'Thank you for your business!',
    createdAt: '2023-09-15T10:30:00Z'
  },
  {
    id: '2',
    clientName: 'Stark Industries',
    invoiceNumber: 'INV-2023-002',
    issueDate: '2023-10-01',
    dueDate: '2023-10-31',
    status: 'pending',
    items: [
      { description: 'Consulting Services', quantity: 10, price: 150 },
      { description: 'Technical Documentation', quantity: 1, price: 350 }
    ],
    notes: 'Net 30 payment terms',
    createdAt: '2023-10-01T14:45:00Z'
  },
  {
    id: '3',
    clientName: 'Wayne Enterprises',
    invoiceNumber: 'INV-2023-003',
    issueDate: '2023-10-15',
    dueDate: '2023-11-15',
    status: 'draft',
    items: [
      { description: 'Security Audit', quantity: 1, price: 2500 },
      { description: 'Penetration Testing', quantity: 2, price: 1200 }
    ],
    notes: '',
    createdAt: '2023-10-15T09:15:00Z'
  }
];

export default MainFeature;