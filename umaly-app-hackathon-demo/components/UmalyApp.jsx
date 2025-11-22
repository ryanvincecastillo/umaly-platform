"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Truck, BarChart3, Sprout, Coffee, Camera, CheckCircle, 
  AlertTriangle, Users, Package, Calendar, Wifi, WifiOff, ChevronRight,
  Factory, Droplets, Sun, ArrowRight, ClipboardCheck, MapPin, Clock,
  Brain, Sparkles, Zap, Store, Building2, ShoppingCart, Send, Archive, 
  XCircle, AlertOctagon, FileText, Scale, Printer, Box, ArrowDownToLine, 
  ArrowUpFromLine, User, LogOut, ChevronsUpDown, Settings, ThumbsUp, ThumbsDown,
  TrendingUp, CloudRain, Activity
} from 'lucide-react';

// --- REALISTIC DATA SETS ---

const DATA_SETS = {
  Cacao: {
    brand: "Cacao de Davao",
    theme: "emerald",
    stations: [
      { id: 's1', name: "Calinan Coop Station", location: "Calinan District", inventory: { wet: 2300, dry: 500 } },
      { id: 's2', name: "Agdao Consolidation Hub", location: "Agdao Proper", inventory: { wet: 1200, dry: 3000 } }
    ],
    farmers: [
      { id: 101, name: "Mang Juan", crop: "Cacao", location: "Malagos Farms", phone: "0917-555-0101", rating: 4.8, distance: "2km from Calinan" },
      { id: 102, name: "Ate Lisa", crop: "Cacao", location: "Sirib Growers", phone: "0927-123-4567", rating: 4.9, distance: "12km from Calinan" },
      { id: 103, name: "Paquibato Clan", crop: "Cacao", location: "Paquibato District", phone: "0918-999-8888", rating: 4.5, distance: "45km from Agdao" },
    ],
    logs: [
      { id: 501, farmer: "Mang Juan", weight: 150, grade: "A", state: "Wet", time: "07:45 AM", station: "Calinan Coop Station" },
      { id: 502, farmer: "Ate Lisa", weight: 80, grade: "B", state: "Wet", time: "09:30 AM", station: "Calinan Coop Station" },
    ],
    orders: [
      { id: 'PO-1001', stationId: 's1', stationName: "Calinan Coop Station", amount: 5000, committed: 4500, filled: 2300, cropState: 'Wet', status: 'Commitment Proposed', deadline: '2023-11-25' },
      { id: 'PO-1002', stationId: 's2', stationName: "Agdao Consolidation Hub", amount: 2000, committed: 2000, filled: 2000, dispatched: 2000, cropState: 'Dry', status: 'In Transit', deadline: '2023-11-24', eta: '2 hrs' }
    ]
  },
  Coffee: {
    brand: "FROG KAFFEE",
    theme: "orange",
    stations: [
      { id: 's3', name: "Toril Depot", location: "Toril", inventory: { wet: 800, dry: 150 } },
      { id: 's4', name: "Bansalan Roastery Hub", location: "Bansalan, Davao del Sur", inventory: { wet: 450, dry: 1200 } }
    ],
    farmers: [
      { id: 201, name: "Mt. Apo Civet Farm", crop: "Coffee", location: "Kapatagan", phone: "0919-000-1111", rating: 5.0, distance: "8km from Bansalan" },
      { id: 202, name: "Marilog Tribal Growers", crop: "Coffee", location: "Marilog Dist.", phone: "0920-222-3333", rating: 4.7, distance: "60km from Toril" },
      { id: 203, name: "Bukidnon High Roast", crop: "Coffee", location: "Lantapan", phone: "0917-888-7777", rating: 4.9, distance: "Transport via Bukidnon-Davao Rd" },
    ],
    logs: [
      { id: 601, farmer: "Mt. Apo Civet Farm", weight: 45, grade: "Premium", state: "Cherry", time: "06:15 AM", station: "Bansalan Roastery Hub" },
    ],
    orders: [
      { id: 'PO-2001', stationId: 's4', stationName: "Bansalan Roastery Hub", amount: 1000, committed: 1000, filled: 1200, dispatched: 1200, cropState: 'Dry', status: 'In Transit', deadline: '2023-11-26', eta: '45 mins' }
    ]
  }
};

const ACCOUNTS = [
  { id: 'acc_cacao', name: "Juan Dela Cruz", role: "Ops Manager", org: "Cacao de Davao", type: "Cacao", initials: "JD", color: "bg-amber-600" },
  { id: 'acc_coffee', name: "Maria Santos", role: "Procurement Lead", org: "FROG KAFFEE", type: "Coffee", initials: "MS", color: "bg-orange-600" }
];

export default function UmalyApp() {
  const [activeView, setActiveView] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(ACCOUNTS[0]);
  const [currentData, setCurrentData] = useState(DATA_SETS['Cacao']);
  
  // --- CENTRALIZED STATE ---
  const [forecasts, setForecasts] = useState([]); 
  const [logs, setLogs] = useState([]); 
  const [orders, setOrders] = useState([]);
  const [stations, setStations] = useState([]); 
  const [notification, setNotification] = useState(null);

  // Switch Data when User Switches
  useEffect(() => {
    const data = DATA_SETS[currentUser.type];
    setCurrentData(data);
    setLogs(data.logs);
    setOrders(data.orders);
    setStations(data.stations);
    setForecasts([]); 
    triggerNotification(`Switched workspace to ${currentUser.org}`, 'info');
  }, [currentUser]);

  const triggerNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- ACTIONS ---
  const handleCreateOrder = (orderData) => {
    const newOrder = { id: `PO-${Math.floor(Math.random()*10000)}`, stationId: orderData.stationId, stationName: stations.find(s => s.id === orderData.stationId).name, amount: parseInt(orderData.amount), committed: 0, filled: 0, dispatched: 0, received: 0, cropState: orderData.cropState, status: 'Pending Review', deadline: orderData.deadline };
    setOrders(prev => [newOrder, ...prev]);
    triggerNotification(`PO Created: Requesting ${newOrder.amount}kg from ${newOrder.stationName}`, 'info');
  };
  const handleCommitOrder = (orderId, committedAmount) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Commitment Proposed', committed: parseInt(committedAmount) } : o)); triggerNotification(`Commitment proposed to SME.`, 'success'); };
  const handleAcceptCommitment = (orderId) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Collecting' } : o)); triggerNotification(`Commitment accepted!`, 'success'); };
  const handleRejectCommitment = (orderId) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Pending Review', committed: 0 } : o)); triggerNotification(`Commitment rejected.`, 'info'); };
  const handleCancelOrder = (orderId) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o)); triggerNotification(`Order ${orderId} cancelled.`, 'info'); };
  const handleDispatchOrder = (orderId) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'In Transit', dispatched: o.filled, eta: '4 hrs' } : o)); triggerNotification(`Shipment Dispatched!`, 'success'); };
  const handleReceiveOrder = (orderId, receivedAmount, notes) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: Math.abs(receivedAmount - o.dispatched) > 5 ? 'Received (Variance)' : 'Received (Perfect)', received: parseInt(receivedAmount), variance: receivedAmount - o.dispatched, notes } : o)); triggerNotification(`Received ${orderId}.`, 'success'); };
  
  const handleStationLog = (logData) => {
    const newLog = { id: Date.now(), farmer: logData.farmerName, weight: parseInt(logData.weight), grade: logData.grade, state: logData.state, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), station: logData.stationName };
    setLogs(prev => [newLog, ...prev]);
    setStations(prev => prev.map(s => {
      if (s.name === logData.stationName) {
        const isWet = logData.state === 'Wet' || logData.state === 'Cherry';
        return { ...s, inventory: { wet: isWet ? s.inventory.wet + newLog.weight : s.inventory.wet, dry: !isWet ? s.inventory.dry + newLog.weight : s.inventory.dry } };
      }
      return s;
    }));
    setOrders(prev => prev.map(o => {
      if (o.stationName === logData.stationName && (o.status === 'Committed' || o.status === 'Collecting')) {
        return { ...o, filled: o.filled + newLog.weight };
      }
      return o;
    }));
    if (logData.forecastId) {
      setForecasts(prev => prev.map(f => f.id === logData.forecastId ? { ...f, status: "Arrived" } : f));
    }
    triggerNotification(`Log Success: ${logData.weight}kg received.`, 'success');
  };

  const handleFarmerForecast = (farmerId, amount) => {
    const farmer = currentData.farmers.find(f => f.id === farmerId);
    const newForecast = { id: Date.now(), farmerId, amount: parseInt(amount), date: "Today", status: "Pending" };
    setForecasts(prev => [newForecast, ...prev]);
    triggerNotification(`AI Forecast: ${farmer.name} confirmed ${amount}kg.`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row overflow-hidden">
      {/* NAVIGATION */}
      <nav className="bg-slate-900 text-white md:w-72 flex-shrink-0 flex md:flex-col justify-between p-4 z-50 shadow-xl border-r border-slate-800">
        <div className="flex items-center gap-3 mb-0 md:mb-8 px-2">
          <div className={`p-2 rounded-xl shadow-lg ${currentUser.type === 'Cacao' ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-orange-400 to-orange-600'}`}>
            {currentUser.type === 'Cacao' ? <Sprout size={24} strokeWidth={2.5} className="text-white" /> : <Coffee size={24} strokeWidth={2.5} className="text-white" />}
          </div>
          <div><h1 className="font-bold text-xl tracking-tight">Umaly</h1><p className="text-xs text-slate-400 opacity-90 font-medium">Mindanao Agri-OS</p></div>
        </div>
        <div className="flex md:flex-col gap-2 w-full overflow-x-auto md:overflow-visible scrollbar-hide">
          <NavBtn icon={<BarChart3 size={20}/>} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <NavBtn icon={<Store size={20}/>} label="Buying Station" active={activeView === 'station'} onClick={() => setActiveView('station')} count={forecasts.filter(f => f.status === 'Pending').length} />
          <NavBtn icon={<MessageSquare size={20}/>} label="Farmer Link" active={activeView === 'farmer'} onClick={() => setActiveView('farmer')} />
        </div>
        <div className="hidden md:block mt-auto pt-6 border-t border-slate-800">
          <UserSwitcher currentUser={currentUser} onSwitch={setCurrentUser} />
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-slate-50/50">
        <Header activeView={activeView} currentUser={currentUser} />
        {notification && <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-2xl z-[60] animate-bounce-in flex items-start gap-4 max-w-sm backdrop-blur-sm ${notification.type === 'success' ? 'bg-emerald-600/95 text-white' : 'bg-blue-600/95 text-white'}`}><div className="mt-1 p-1 bg-white/20 rounded-full"><CheckCircle size={16} /></div><div><h4 className="font-bold text-sm uppercase tracking-wide opacity-90">{notification.type === 'success' ? 'Success' : 'AI Update'}</h4><p className="text-sm font-medium leading-snug">{notification.msg}</p></div></div>}

        {activeView === 'dashboard' && <DashboardView cropType={currentUser.type} forecasts={forecasts} logs={logs} stations={stations} brand={currentData.brand} orders={orders} onCreateOrder={handleCreateOrder} onCancelOrder={handleCancelOrder} onReceiveOrder={handleReceiveOrder} onAcceptCommitment={handleAcceptCommitment} onRejectCommitment={handleRejectCommitment} />}
        {activeView === 'station' && <BuyingStationView cropType={currentUser.type} farmers={currentData.farmers} stations={stations} forecasts={forecasts} onLog={handleStationLog} orders={orders} onDispatch={handleDispatchOrder} onCommit={handleCommitOrder} />}
        {activeView === 'farmer' && <FarmerSimulator cropType={currentUser.type} farmers={currentData.farmers} onForecast={handleFarmerForecast} orders={orders} />}
      </main>
    </div>
  );
}

// --- NAVBTN COMPONENT ---
const NavBtn = ({ icon, label, active, onClick, count }) => (
  <button onClick={onClick} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all w-full whitespace-nowrap group ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-300 hover:bg-slate-800'}`}>
    <div className="flex items-center gap-3">{icon}<span className="font-medium text-sm">{label}</span></div>
    {count > 0 && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white text-emerald-600' : 'bg-emerald-600 text-white'}`}>{count}</span>}
  </button>
);

// --- USER SWITCHER COMPONENT ---
const UserSwitcher = ({ currentUser, onSwitch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 px-3 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50 w-full hover:bg-slate-800 transition-all group">
        <div className={`w-10 h-10 rounded-full ${currentUser.color} flex items-center justify-center text-sm font-bold text-white shadow-md`}>{currentUser.initials}</div>
        <div className="text-left flex-1 overflow-hidden"><p className="font-bold text-sm truncate text-slate-200 group-hover:text-white">{currentUser.name}</p><p className="text-xs text-slate-400 truncate">{currentUser.org}</p></div>
        <ChevronsUpDown size={16} className="text-slate-500" />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden z-50">
          <div className="p-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1.5">Switch Organization</p>
            {ACCOUNTS.map(acc => (
              <button key={acc.id} onClick={() => { onSwitch(acc); setIsOpen(false); }} className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${currentUser.id === acc.id ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}>
                <div className={`w-8 h-8 rounded-full ${acc.color} flex items-center justify-center text-xs font-bold text-white`}>{acc.initials}</div>
                <div className="text-left"><p className="font-medium text-sm">{acc.org}</p><p className="text-[10px] opacity-70">{acc.role}</p></div>
                {currentUser.id === acc.id && <CheckCircle size={14} className="ml-auto text-emerald-400"/>}
              </button>
            ))}
          </div>
          <div className="border-t border-slate-700 p-2 bg-slate-900/50">
            <button className="flex items-center gap-3 w-full p-2 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"><Settings size={16} /> Account Settings</button>
            <button className="flex items-center gap-3 w-full p-2 text-slate-400 hover:text-red-400 text-sm rounded-lg hover:bg-slate-800 transition-colors"><LogOut size={16} /> Log Out</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HEADER COMPONENT ---
const Header = ({ activeView, currentUser }) => (
  <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <div>
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          {activeView === 'dashboard' ? 'Supply Chain Command' : 
           activeView === 'station' ? 'Station Operations' : 'Farmer Simulation'}
        </h2>
        <span className="text-slate-300 text-2xl font-light">/</span>
        <div className="flex items-center gap-2">
          {currentUser.type === 'Cacao' ? <Sprout size={20} className="text-amber-700"/> : <Coffee size={20} className="text-orange-700"/>}
          <h2 className="text-2xl font-bold text-slate-700">{currentUser.org}</h2>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <p className="text-slate-500 text-sm font-medium">System Status: <span className="text-emerald-600 font-bold">Live</span> • User: {currentUser.name}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
       <div className="text-right hidden md:block"><p className="text-xs font-bold text-slate-400 uppercase">Current Context</p><p className="text-sm font-bold text-slate-700">{currentUser.role}</p></div>
       <div className={`w-10 h-10 rounded-xl ${currentUser.color} flex items-center justify-center text-white font-bold shadow-md`}>{currentUser.initials}</div>
    </div>
  </header>
);

// --- 1. DASHBOARD VIEW ---
const DashboardView = ({ cropType, forecasts, logs, stations, brand, orders, onCreateOrder, onCancelOrder, onReceiveOrder, onAcceptCommitment, onRejectCommitment }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ stationId: stations[0]?.id, amount: 1000, cropState: 'Wet', deadline: '' });
  const [receiveData, setReceiveData] = useState({ amount: '', notes: '' });
  const [receivingOrder, setReceivingOrder] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  const totalWet = stations.reduce((acc, s) => acc + s.inventory.wet, 0);
  const dailyBurnRate = 200; 
  const daysOfInventory = Math.round(totalWet / dailyBurnRate);
  const isLowStock = daysOfInventory < 7;

  const [aiInsight, setAiInsight] = useState(null);
  // Add this Effect
  useEffect(() => {
    const fetchAiInsight = async () => {
      // 1. Gather Context
      const context = {
        stock: stations.reduce((acc, s) => acc + s.inventory.wet, 0), // Total Wet Stock
        burnRate: 200, // Hardcoded for demo, usually from DB
        pendingOrders: orders.filter(o => o.status !== 'Received').length
      };

      // 2. Call API
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentType: 'planner', context })
      });

      const data = await res.json();
      setAiInsight(data);
    };

    if(stations.length > 0) fetchAiInsight();
  }, [stations, orders]);

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    const deadline = new Date(dateStr);
    const today = new Date("2023-11-20");
    return deadline < today;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        <button onClick={() => setActiveTab('overview')} className={`pb-2 text-sm font-bold transition-all ${activeTab === 'overview' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400'}`}>Overview & AI Insights</button>
        <button onClick={() => setActiveTab('procurement')} className={`pb-2 text-sm font-bold transition-all ${activeTab === 'procurement' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400'}`}>Procurement</button>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* AI DEMAND PLANNER */}
          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="bg-indigo-800 p-4 rounded-full border border-indigo-700"><Brain size={32} className="text-indigo-300" /></div>
                <div className="flex-1">
                   <h3 className="text-xl font-bold mb-2 flex items-center gap-2">AI Demand Planner <span className="text-xs bg-indigo-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Autonomous</span></h3>
                   <div className="grid grid-cols-3 gap-4 mb-4 text-indigo-200 text-sm">
                      <div><p className="text-xs opacity-60 uppercase">Current Stock</p><p className="font-bold text-white">{totalWet} kg</p></div>
                      <div><p className="text-xs opacity-60 uppercase">Daily Burn Rate</p><p className="font-bold text-white">{dailyBurnRate} kg/day</p></div>
                      <div><p className="text-xs opacity-60 uppercase">Days Remaining</p><p className={`font-bold ${isLowStock ? 'text-red-400' : 'text-emerald-400'}`}>{daysOfInventory} Days</p></div>
                   </div>
                   <p className="text-sm bg-indigo-800/50 p-3 rounded-lg border border-indigo-700/50 leading-relaxed">{isLowStock ? `🚨 Critical Alert: Inventory will run out in ${daysOfInventory} days. Based on historical lead times (3 days), I recommend creating a PO for 2,000kg immediately.` : `✅ Operations Healthy. Supply coverage is sufficient. Market prices trending up (+5%); consider locking in future order.`}</p>
                </div>
                {isLowStock && <button onClick={() => setActiveTab('procurement')} className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"><Zap size={18} className="text-amber-500 fill-current" /> Auto-Generate PO</button>}
             </div>
             <div className="absolute -right-10 -bottom-20 opacity-10"><Activity size={300}/></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <MetricCard title="Total Network Stock" value={`${totalWet} kg`} sub="Raw Material" color="emerald" icon={<Package size={20}/>} />
             <MetricCard title="Pending Orders" value={orders.filter(o => o.status !== 'Received' && o.status !== 'Cancelled').length} sub="In Pipeline" color="blue" icon={<ClipboardCheck size={20}/>} />
             <MetricCard title="Market Trend" value="+5.2%" sub="Price/kg (Calinan)" color="amber" icon={<TrendingUp size={20}/>} />
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div><h3 className="font-bold text-slate-700 text-lg">Procurement Cycle</h3><p className="text-xs text-slate-500">Manage POs & Receiving</p></div>
            <button onClick={() => setIsOrderModalOpen(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 flex items-center gap-2"><ShoppingCart size={16}/> New Purchase Order</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {orders.map(order => {
              const isTransit = order.status === 'In Transit';
              const isReceived = order.status.includes('Received');
              const isProposed = order.status === 'Commitment Proposed';
              const overdue = isOverdue(order.deadline) && !isReceived && order.status !== 'Cancelled';
              
              return (
              <div key={order.id} className={`bg-white p-6 rounded-xl shadow-sm border ${isProposed ? 'border-blue-300 ring-1 ring-blue-100' : isReceived ? 'border-slate-100 bg-slate-50' : 'border-slate-200'} flex flex-col md:flex-row justify-between items-start gap-4`}>
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${isTransit ? 'bg-blue-100 text-blue-600 animate-pulse' : isReceived ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>{isReceived ? <ClipboardCheck size={24}/> : overdue ? <AlertOctagon size={24} className="text-red-500"/> : <Truck size={24}/>}</div>
                  <div>
                    <div className="flex items-center gap-2"><h4 className="font-bold text-lg text-slate-800">{order.id}</h4><span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isTransit ? 'bg-blue-600 text-white' : isProposed ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>{order.status}</span>{overdue && <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded animate-pulse">OVERDUE</span>}</div>
                    <p className="text-sm text-slate-500 mt-1"><span className="font-medium text-slate-700">{order.stationName}</span> &rarr; Factory</p>
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col gap-3 items-end">
                  {isProposed && (
                    <div className="w-full bg-blue-50 p-3 rounded-lg border border-blue-100"><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-blue-800 uppercase">Commitment Offer</span><span className="text-sm font-bold text-slate-700">{order.committed} kg</span></div><div className="flex gap-2"><button onClick={() => onAcceptCommitment(order.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700"><ThumbsUp size={12}/> Accept</button><button onClick={() => onRejectCommitment(order.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-300 text-slate-600 text-xs font-bold rounded hover:bg-slate-50"><ThumbsDown size={12}/> Decline</button></div></div>
                  )}
                  {!isReceived && !isProposed && order.status !== 'Cancelled' && order.status !== 'Pending Review' && (
                    <div className="w-full"><div className="flex justify-between text-xs font-bold text-slate-500 mb-1"><span>Progress</span><span>{order.filled} / {order.committed || order.amount} kg</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${isTransit ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${Math.min((order.filled/(order.committed || order.amount))*100, 100)}%` }}></div></div></div>
                  )}
                  <div className="flex gap-2">
                    {isTransit && <button onClick={() => { setReceivingOrder(order); setReceiveData({ amount: order.dispatched, notes: '' }); }} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-md hover:bg-blue-700 flex items-center gap-2"><Scale size={16}/> Receive</button>}
                    {(order.status === 'Collecting' || order.status === 'Pending Review' || order.status === 'Commitment Proposed') && <button onClick={() => onCancelOrder(order.id)} className="text-xs text-red-400 font-bold hover:text-red-600 px-3 py-2 border border-red-200 rounded bg-red-50">Cancel PO</button>}
                    {isReceived && <button onClick={() => setViewingReport(order)} className="px-3 py-1.5 rounded border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 flex items-center gap-2"><FileText size={14}/> Report</button>}
                  </div>
                </div>
              </div>
            )})}
          </div>
          
          {/* MODALS */}
          {isOrderModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4"><div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"><h3 className="font-bold text-xl text-slate-800 mb-4">Create PO</h3><div className="space-y-4"><div><label className="block text-xs font-bold text-slate-400 uppercase mb-1">Station</label><select className="w-full p-3 border rounded-lg" onChange={(e) => setNewOrder({...newOrder, stationId: e.target.value})}>{stations.map(s => <option key={s.id} value={s.id}>{s.name} (Stock: {s.inventory.wet}kg)</option>)}</select></div><div><label className="block text-xs font-bold text-slate-400 uppercase mb-1">Amount (kg)</label><input type="number" className="w-full p-3 border rounded-lg" value={newOrder.amount} onChange={(e) => setNewOrder({...newOrder, amount: e.target.value})}/></div><div><label className="block text-xs font-bold text-slate-400 uppercase mb-1">Deadline</label><input type="date" className="w-full p-3 border rounded-lg" onChange={(e) => setNewOrder({...newOrder, deadline: e.target.value})}/></div><button onClick={() => { onCreateOrder(newOrder); setIsOrderModalOpen(false); }} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700">Send PO</button><button onClick={() => setIsOrderModalOpen(false)} className="w-full text-slate-400 text-sm font-bold py-2">Cancel</button></div></div></div>}
          
          {receivingOrder && <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[70] p-4"><div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4"><h3 className="font-bold text-xl">Receive Shipment</h3><div className="grid grid-cols-2 gap-4 text-center bg-slate-50 p-4 rounded-xl"><div><p className="text-xs font-bold text-slate-400">Dispatched</p><p className="text-lg font-bold text-blue-600">{receivingOrder.dispatched} kg</p></div><div><p className="text-xs font-bold text-slate-400">Variance</p><p className={`text-lg font-bold ${parseInt(receiveData.amount)-receivingOrder.dispatched < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{parseInt(receiveData.amount)-receivingOrder.dispatched || 0} kg</p></div></div><div><label className="block text-xs font-bold text-slate-500 mb-1">Actual Weight</label><input type="number" className="w-full p-3 border rounded-lg font-bold text-lg" value={receiveData.amount} onChange={(e) => setReceiveData({...receiveData, amount: e.target.value})}/></div><div><label className="block text-xs font-bold text-slate-500 mb-1">Notes</label><textarea className="w-full p-3 border rounded-lg" rows="2" value={receiveData.notes} onChange={(e) => setReceiveData({...receiveData, notes: e.target.value})}></textarea></div><div className="flex gap-3"><button onClick={() => setReceivingOrder(null)} className="flex-1 py-3 rounded-lg font-bold text-slate-500 hover:bg-slate-100">Cancel</button><button onClick={() => { onReceiveOrder(receivingOrder.id, receiveData.amount, receiveData.notes); setReceivingOrder(null); }} className="flex-1 py-3 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700">Confirm</button></div></div></div>}

          {viewingReport && <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[70] p-4"><div className="bg-white rounded-2xl w-full max-w-2xl p-6 space-y-6"><div className="flex justify-between"><div><h3 className="font-bold text-xl flex items-center gap-2"><FileText className="text-emerald-500"/> Receiving Report</h3><p className="text-xs text-slate-400">{viewingReport.id}</p></div><button onClick={() => setViewingReport(null)}><XCircle className="text-slate-400"/></button></div><div className={`p-4 rounded-lg border flex justify-between items-center ${viewingReport.variance !== 0 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}><div><h4 className="font-bold text-lg">{viewingReport.variance !== 0 ? 'Discrepancy Detected' : 'Perfect Match'}</h4></div><div className="text-right"><p className="text-xs font-bold uppercase">Variance</p><p className="text-2xl font-bold">{viewingReport.variance} kg</p></div></div><div className="grid grid-cols-3 gap-4 text-center"><div><p className="text-xs text-slate-400 font-bold">Ordered</p><p className="text-xl font-bold text-slate-700">{viewingReport.amount}kg</p></div><div><p className="text-xs text-blue-400 font-bold">Dispatched</p><p className="text-xl font-bold text-blue-700">{viewingReport.dispatched}kg</p></div><div><p className="text-xs text-emerald-400 font-bold">Received</p><p className="text-xl font-bold text-emerald-700">{viewingReport.received}kg</p></div></div><div className="pt-4 border-t"><p className="text-xs font-bold text-slate-400 mb-1">Notes</p><p className="text-sm italic text-slate-600">"{viewingReport.notes || 'No notes.'}"</p></div><div className="flex justify-end"><button onClick={() => setViewingReport(null)} className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg">Close</button></div></div></div>}
        </div>
      )}
    </div>
  );
};

// --- 2. BUYING STATION VIEW (RE-ARCHITECTED) ---
const BuyingStationView = ({ cropType, farmers, stations, forecasts, onLog, orders, onDispatch, onCommit }) => {
  // New Tabs: Inbound (Scale), Inventory (Stock Monitor), Outbound (Orders/Commitment)
  const [activeTab, setActiveTab] = useState('inbound'); 
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const [commitModal, setCommitModal] = useState(null);
  const [commitAmount, setCommitAmount] = useState('');

  // State for Scale
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ farmerName: '', weight: '', state: cropType === 'Cacao' ? 'Wet' : 'Cherry' });
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedForecast, setSelectedForecast] = useState(null);

  useEffect(() => { if (stations.length > 0) setSelectedStation(stations[0]); }, [stations]);
  
  const stationOrders = orders.filter(o => o.stationId === selectedStation.id);
  const incomingForecastTotal = forecasts.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.amount, 0);

  // Handlers
  const handleScan = () => { setScanning(true); setTimeout(() => { setScanning(false); setScanResult({ quality: "Grade A", defect: "1.2%", moisture: "Optimal" }); setStep(2); }, 1500); };
  const handleSubmit = () => { onLog({ ...formData, grade: scanResult ? scanResult.quality : 'A', forecastId: selectedForecast?.id, stationName: selectedStation.name }); setStep(1); setFormData({ farmerName: '', weight: '', state: cropType === 'Cacao' ? 'Wet' : 'Cherry' }); setSelectedForecast(null); setScanResult(null); };

  return (
    <div className="animate-fade-in pb-20">
      {/* TOP CONTROL BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto">
          <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Select Station</label>
          <select className="block w-full font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500" value={selectedStation.id} onChange={(e) => setSelectedStation(stations.find(s => s.id === e.target.value))}>
            {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg gap-1 w-full md:w-auto">
           <button onClick={() => setActiveTab('inbound')} className={`flex-1 md:flex-none px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'inbound' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
             <ArrowDownToLine size={16}/> Inbound
           </button>
           <button onClick={() => setActiveTab('inventory')} className={`flex-1 md:flex-none px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'inventory' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
             <Box size={16}/> Inventory
           </button>
           <button onClick={() => setActiveTab('outbound')} className={`flex-1 md:flex-none px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'outbound' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
             <ArrowUpFromLine size={16}/> Outbound
             {stationOrders.filter(o => o.status === 'Pending Review').length > 0 && <span className="w-2 h-2 rounded-full bg-red-500 ml-1"></span>}
           </button>
        </div>
      </div>

      {/* === TAB 1: INBOUND (The Weighing Scale) === */}
      {activeTab === 'inbound' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
             <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
               <h3 className="font-bold text-slate-700">Incoming Forecasts</h3>
               <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{forecasts.filter(f => f.status === 'Pending').length} Pending</span>
             </div>
             <div className="p-4 space-y-3 overflow-y-auto">
                {forecasts.filter(f => f.status === 'Pending').length === 0 && <div className="text-center text-slate-400 text-sm py-10">No pending farmer deliveries.</div>}
                {forecasts.filter(f => f.status === 'Pending').map(f => {
                   const farmer = farmers.find(fam => fam.id === f.farmerId);
                   if(!farmer) return null;
                   return (
                     <div key={f.id} onClick={() => {setSelectedForecast(f); setFormData({...formData, farmerName: farmer.name, weight: f.amount}); setStep(1);}} className="p-4 rounded-xl border cursor-pointer hover:shadow-md bg-white border-slate-200 hover:border-emerald-300 transition-all group">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-slate-800 group-hover:text-emerald-600">{farmer.name}</h4>
                          <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">{f.amount}kg</span>
                        </div>
                        <div className="text-xs text-slate-400 flex gap-2"><MapPin size={12}/> {farmer.location}</div>
                     </div>
                   );
                })}
             </div>
           </div>
           
           {/* Digital Scale Interface */}
           <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-5 bg-slate-800 text-white flex justify-between items-center shadow-lg z-10">
                <div><h3 className="font-bold text-lg">Digital Weighing Scale</h3><p className="text-xs text-slate-400">Connected: Scale_BT_04</p></div>
                <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30"><Wifi size={14} className="text-emerald-400"/><span className="text-xs font-mono text-emerald-400 font-bold">ONLINE</span></div>
              </div>
              <div className="p-8 flex-1 bg-slate-50/50">
                 {step === 1 ? (
                    <div className="max-w-md mx-auto space-y-6 animate-slide-in">
                       <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Farmer Identification</label><select className="w-full p-4 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-emerald-500" value={formData.farmerName} onChange={(e) => setFormData({...formData, farmerName: e.target.value})}><option value="">-- Select Farmer --</option>{farmers.map(f => <option key={f.id} value={f.name}>{f.name} ({f.location})</option>)}</select></div>
                       
                       <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Crop State</label><div className="grid grid-cols-2 gap-3"><button onClick={() => setFormData({...formData, state: cropType === 'Cacao' ? 'Wet' : 'Cherry'})} className={`p-4 rounded-xl border font-bold text-sm transition-all ${formData.state === (cropType === 'Cacao' ? 'Wet' : 'Cherry') ? 'bg-emerald-600 text-white shadow-lg border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{cropType === 'Cacao' ? 'Wet Beans' : 'Fresh Cherry'}</button><button onClick={() => setFormData({...formData, state: cropType === 'Cacao' ? 'Dry' : 'Green'})} className={`p-4 rounded-xl border font-bold text-sm transition-all ${formData.state === (cropType === 'Cacao' ? 'Dry' : 'Green') ? 'bg-emerald-600 text-white shadow-lg border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{cropType === 'Cacao' ? 'Dried Beans' : 'Green Beans'}</button></div></div>

                       <div onClick={handleScan} className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all bg-white">
                          {scanning ? <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div><p className="text-sm font-bold text-emerald-600">Analyzing Quality...</p></div> : <><Camera size={32} className="text-slate-400 mb-2"/><p className="text-slate-600 font-bold">Tap to AI Grade</p><p className="text-xs text-slate-400">Analyzes ripeness & defects</p></>}
                       </div>
                    </div>
                 ) : (
                    <div className="max-w-md mx-auto space-y-6 animate-slide-in">
                       <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                         <div className="absolute right-0 top-0 p-4 opacity-10"><Brain size={80}/></div>
                         <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Sparkles size={12}/> AI Analysis</h4>
                         <div className="flex justify-between items-end"><div><span className="text-slate-400 text-xs block">Quality Grade</span><span className="text-4xl font-bold text-white">{scanResult.quality}</span></div><div className="text-right"><span className="text-slate-400 text-xs block">Defects</span><span className="text-xl font-bold text-emerald-400">{scanResult.defect}</span></div></div>
                       </div>
                       <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Final Weight (Kg)</label><input type="number" className="w-full p-4 bg-white border border-slate-300 rounded-xl text-4xl font-bold text-slate-800 font-mono shadow-sm" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})}/></div>
                       <div className="grid grid-cols-2 gap-3"><button onClick={() => setStep(1)} className="py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">Retake</button><button onClick={handleSubmit} className="py-4 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all">Confirm Log</button></div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* === TAB 2: INVENTORY MONITOR (NEW) === */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Physical Stock (On Hand)</p>
              <h3 className="text-3xl font-bold text-slate-800">{(selectedStation.inventory.wet + selectedStation.inventory.dry).toLocaleString()} <span className="text-sm font-medium text-slate-400">kg</span></h3>
              <div className="mt-3 flex gap-2 text-xs"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold">Wet: {selectedStation.inventory.wet}</span><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold">Dry: {selectedStation.inventory.dry}</span></div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 p-4 opacity-5"><MessageSquare size={80}/></div>
              <p className="text-xs font-bold text-blue-400 uppercase mb-1">Incoming Forecast (Chat)</p>
              <h3 className="text-3xl font-bold text-blue-700">+{incomingForecastTotal} <span className="text-sm font-medium text-blue-400">kg</span></h3>
              <p className="text-xs text-blue-500 mt-2 font-medium">Based on farmer SMS replies</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-sm">
              <p className="text-xs font-bold text-purple-400 uppercase mb-1">Available to Promise (ATP)</p>
              <h3 className="text-3xl font-bold text-purple-700">
                {(selectedStation.inventory.wet + selectedStation.inventory.dry + incomingForecastTotal - stationOrders.filter(o => o.status === 'Committed' || o.status === 'Collecting').reduce((acc, o) => acc + o.committed, 0)).toLocaleString()} 
                <span className="text-sm font-medium text-purple-400"> kg</span>
              </h3>
              <p className="text-xs text-purple-500 mt-2 font-medium">Safe to commit to SMEs</p>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50"><h4 className="font-bold text-slate-700 text-sm">Stock Breakdown</h4></div>
            <div className="p-6">
              <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden flex">
                <div className="bg-amber-500 h-full" style={{ width: `${(selectedStation.inventory.wet / (selectedStation.inventory.wet + selectedStation.inventory.dry)) * 100}%` }}></div>
                <div className="bg-emerald-500 h-full" style={{ width: `${(selectedStation.inventory.dry / (selectedStation.inventory.wet + selectedStation.inventory.dry)) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mt-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div> Wet / Raw ({selectedStation.inventory.wet} kg)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Dry / Processed ({selectedStation.inventory.dry} kg)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === TAB 3: OUTBOUND (Enhanced Fulfillment) === */}
      {activeTab === 'outbound' && (
        <div className="space-y-4 animate-fade-in">
          {stationOrders.length === 0 ? <div className="text-center py-20 text-slate-400 font-medium">No active orders.</div> : stationOrders.map(order => {
             // Calculate ATP for this specific order scenario
             const availableStock = selectedStation.inventory[order.cropState === 'Wet' ? 'wet' : 'dry'];
             const totalAvailable = availableStock + (order.cropState === 'Wet' ? incomingForecastTotal : 0);
             const isPending = order.status === 'Pending Review';
             const isCommitted = order.status === 'Committed' || order.status === 'Collecting';

             return (
               <div key={order.id} className={`bg-white p-6 rounded-xl shadow-sm border ${isPending ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-lg">{order.id}</h4>
                          {isPending && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase animate-pulse">Action Required</span>}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">SME Request: <span className="font-bold text-slate-800">{order.amount}kg {order.cropState}</span></p>
                     </div>
                     <div className={`px-3 py-1 rounded text-xs font-bold ${order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{order.status}</div>
                  </div>

                  {isPending ? (
                    // COMMITMENT INTERFACE
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div className="bg-white p-2 rounded border border-slate-200"><p className="text-[10px] font-bold text-slate-400 uppercase">Requested</p><p className="text-lg font-bold text-slate-800">{order.amount}</p></div>
                        <div className="bg-white p-2 rounded border border-slate-200"><p className="text-[10px] font-bold text-slate-400 uppercase">On Hand</p><p className="text-lg font-bold text-emerald-600">{availableStock}</p></div>
                        <div className="bg-white p-2 rounded border border-slate-200"><p className="text-[10px] font-bold text-slate-400 uppercase">Incoming (Chat)</p><p className="text-lg font-bold text-blue-600">+{incomingForecastTotal}</p></div>
                      </div>
                      <button onClick={() => setCommitModal(order)} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md">
                        Review & Propose Commitment
                      </button>
                    </div>
                  ) : (
                    // DISPATCH INTERFACE
                    <div className="space-y-3">
                       <div className="flex justify-between text-sm bg-slate-50 p-3 rounded-lg">
                          <span className="text-slate-500 font-medium">Committed Amount:</span>
                          <span className="text-indigo-700 font-bold">{order.committed} kg</span>
                       </div>
                       {order.status !== 'In Transit' && order.status !== 'Received' && order.status !== 'Cancelled' && (
                         <div className="flex gap-2">
                           <div className="flex-1 bg-slate-100 rounded-lg h-10 flex items-center px-3 relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 bg-emerald-200" style={{width: `${(order.filled/order.committed)*100}%`}}></div>
                              <span className="relative z-10 text-xs font-bold text-slate-600 flex justify-between w-full">
                                <span>Collected: {order.filled}kg</span>
                                <span>{Math.round((order.filled/order.committed)*100)}%</span>
                              </span>
                           </div>
                           <button onClick={() => onDispatch(order.id)} disabled={order.filled < order.committed} className={`px-4 rounded-lg font-bold text-sm ${order.filled >= order.committed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                             Dispatch
                           </button>
                         </div>
                       )}
                    </div>
                  )}
               </div>
             );
           })}
        </div>
      )}

      {/* COMMITMENT MODAL */}
      {commitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-slate-800 p-5 text-white"><h3 className="font-bold text-lg">Commit Stock to Order</h3><p className="text-xs text-slate-400">{commitModal.id}</p></div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">How much stock can you guarantee for this order?</p>
              
              <div className="space-y-2">
                <button onClick={() => setCommitAmount(commitModal.amount)} className="w-full p-3 border border-slate-200 rounded-lg flex justify-between items-center hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                  <span className="text-sm font-bold text-slate-700">Full Commitment</span>
                  <span className="text-emerald-600 font-bold group-hover:text-indigo-600">{commitModal.amount} kg</span>
                </button>
                <button onClick={() => setCommitAmount(Math.min(commitModal.amount, selectedStation.inventory[commitModal.cropState === 'Wet' ? 'wet' : 'dry'] + incomingForecastTotal))} className="w-full p-3 border border-slate-200 rounded-lg flex justify-between items-center hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                  <span className="text-sm font-bold text-slate-700">Max Available (ATP)</span>
                  <span className="text-amber-600 font-bold group-hover:text-indigo-600">{Math.min(commitModal.amount, selectedStation.inventory[commitModal.cropState === 'Wet' ? 'wet' : 'dry'] + incomingForecastTotal)} kg</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Custom Amount</label>
                <input type="number" className="w-full p-3 border border-slate-300 rounded-lg font-bold text-lg" value={commitAmount} onChange={(e) => setCommitAmount(e.target.value)} placeholder="Enter amount..." />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => {setCommitModal(null); setCommitAmount('');}} className="flex-1 py-3 rounded-lg font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                <button onClick={() => { onCommit(commitModal.id, commitAmount); setCommitModal(null); setCommitAmount(''); }} className="flex-1 py-3 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg">Submit Proposal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 3. FARMER SIMULATOR (AGENT-DRIVEN CHAT) ---
const FarmerSimulator = ({ cropType, farmers, onForecast, orders }) => {
  const [mode, setMode] = useState('chat'); // Default to Chat to show Agent
  const [currentFarmer, setCurrentFarmer] = useState(farmers[0]);

  // Find an active collecting order to simulate "Demand Context"
  const activeOrder = orders.find(o => o.status === 'Collecting' || o.status === 'Commitment Proposed');

  useEffect(() => { if (farmers.length > 0) setCurrentFarmer(farmers[0]); }, [farmers]);
  if (!currentFarmer) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-center items-start pt-4 pb-20 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full lg:w-72 space-y-6">
        <div><label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Active Farmer</label><select className="w-full p-2.5 bg-slate-50 border rounded-lg" value={currentFarmer.id} onChange={(e) => setCurrentFarmer(farmers.find(f => f.id === parseInt(e.target.value)))}>{farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
        <div><label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Mode</label><div className="space-y-2"><button onClick={() => setMode('app')} className={`w-full flex gap-3 px-4 py-3 rounded-lg text-sm font-bold ${mode === 'app' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500' : 'bg-white border'}`}><Wifi size={16}/> App Mode</button><button onClick={() => setMode('chat')} className={`w-full flex gap-3 px-4 py-3 rounded-lg text-sm font-bold ${mode === 'chat' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'bg-white border'}`}><WifiOff size={16}/> SMS Mode</button></div></div>
      </div>
      <div className="relative mx-auto">
        <div className="w-[340px] h-[680px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl relative border-[6px] border-slate-800">
           <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
             {mode === 'app' ? <AppMode cropType={cropType} farmer={currentFarmer} onSubmit={onForecast} /> : <AgentChatMode cropType={cropType} farmer={currentFarmer} onSubmit={onForecast} activeOrder={activeOrder} />}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- NEW: AGENT CHAT MODE ---
const AgentChatMode = ({ cropType, farmer, onSubmit, activeOrder }) => {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState(null);

  // AI AGENT "WAKE UP" LOGIC
  useEffect(() => {
    const generateIntro = async () => {
      // 1. Call API
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agentType: 'scout', 
          context: {
            farmerName: farmer.name,
            weather: "Rainy on Friday", // Mocked live weather
            lastHarvest: "2 weeks ago"
          }
        })
      });

      const data = await res.json();
      
      // 2. Set Message
      setMessages([{ id: 1, sender: 'bot', text: data.message }]);
      
      // ... Keep your existing options logic here
      setOptions([
        { label: "Yes (50kg)", val: 50 },
        { label: "No (Dili pa)", val: 0 }
      ]);
    };

    generateIntro();
  }, [farmer]);

  const handleReply = (opt) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: opt.label }]);
    setOptions(null);

    setTimeout(() => {
      if (opt.val > 0) {
        setMessages(prev => [...prev, { id: Date.now()+1, sender: 'bot', text: `Salamat! Gi-reserve na nako ang slot para sa imong ${opt.val}kg. Amping sa ulan!` }]);
        onSubmit(farmer.id, opt.val);
      } else {
        setMessages(prev => [...prev, { id: Date.now()+1, sender: 'bot', text: "Sige noted. Update lang ko sunod. Amping!" }]);
      }
    }, 1000);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-4 py-4 border-b bg-slate-50 flex items-center gap-3">
         <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white"><Brain size={20} /></div>
         <div><p className="font-bold text-sm text-slate-800">Umaly AI Agent</p><p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wide">Active Scout</p></div>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
             {m.sender === 'bot' && <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1"><Brain size={12} className="text-indigo-600"/></div>}
             <div className={`max-w-[80%] p-3 text-sm rounded-2xl shadow-sm ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'}`}>
               {m.text}
             </div>
          </div>
        ))}
      </div>
      {options && <div className="p-4 border-t grid grid-cols-1 gap-2">{options.map((opt, i) => <button key={i} onClick={() => handleReply(opt)} className="py-3 border rounded-lg text-sm font-bold bg-white hover:bg-slate-50 text-slate-700">{opt.label}</button>)}</div>}
    </div>
  );
};

// --- APP MODE (Kept simple) ---
const AppMode = ({ cropType, farmer, onSubmit }) => {
    const [weight, setWeight] = useState(50);
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = () => { setSubmitted(true); setTimeout(() => { onSubmit(farmer.id, weight); setSubmitted(false); }, 1500); };
    if (submitted) return <div className="h-full flex flex-col items-center justify-center bg-emerald-600 text-white p-8 text-center"><CheckCircle size={40} className="mb-4"/><h3 className="text-2xl font-bold">Sent!</h3><p>Salamat, {farmer.name}.</p></div>;
    return (
      <div className="h-full bg-slate-50 flex flex-col">
        <div className="bg-emerald-600 p-6 pb-10 text-white rounded-b-[2.5rem] shadow-lg"><h2 className="text-2xl font-bold mt-10">Harvest<br/>Update</h2></div>
        <div className="flex-1 px-6 -mt-6 space-y-4 pt-6">
          <div className="bg-white p-5 rounded-xl shadow-sm"><label className="text-xs font-bold text-slate-400 uppercase">Weight</label><div className="flex justify-between items-end mb-4"><span className="text-4xl font-bold text-emerald-600">{weight}</span><span className="text-lg font-bold text-slate-400">kg</span></div><input type="range" min="10" max="200" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full accent-emerald-600"/></div>
          <button onClick={handleSubmit} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg">Submit Forecast</button>
        </div>
      </div>
    );
};

const MetricCard = ({ title, value, sub, color, icon }) => (
  <div className={`bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow border-l-4 border-l-${color}-500`}>
    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{title}</p><h3 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">{value}</h3><span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${color}-50 text-${color}-600`}>{sub}</span></div>
    <div className={`p-3 bg-${color}-50 rounded-lg text-${color}-600`}>{icon}</div>
  </div>
);