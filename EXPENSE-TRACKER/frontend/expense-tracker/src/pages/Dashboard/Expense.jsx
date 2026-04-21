import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import { useCurrency } from "../../context/CurrencyContext";
import Modal from "../../components/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";

// Expense page - Manages all expense transactions with add, delete, download, and visualization features
const Expense = () => {
    useUserAuth();

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

    // Fetch all expense transactions for current user from API
    const fetchExpenseDetails = async () => {
        // Prevent multiple simultaneous requests if already loading
        if(loading) return;
    
        setLoading(true);
    
        try{
            // API call to retrieve all expense records for authenticated user
            const response = await axiosInstance.get(
                `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
            );
    
            // Update component state with fetched expense data
            if(response.data){
                setExpenseData(response.data);
            }
        } catch (error) {
            console.log("Something went wrong. Please try again.", error);
        } finally {
            // Always disable loading state, whether request succeeded or failed
            setLoading(false);
        }
    };


    // Handle Add Expense - Validates input and sends new expense to API
    const handleAddExpense = async (expense) => {
        // Destructure expense object to extract form fields
        const {category, amount, date, icon} = expense;
        
        //Validation Checks
        if (!category.trim()){
            toast.error("Категорията е задължителна.");
            return;
        }
        
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Сумата трябва да е валидно число, по-голямо от 0.");
            return;
        }
        
        if (!date) {
            toast.error("Датата е задължителна.");
            return;
        }
        
        try {
            await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
                category,
                amount,
                date,
                icon,
            });
        
            setOpenAddExpenseModal(false);
            toast.success("Разход добавен успешно.");
            fetchExpenseDetails();
        } catch (error) {
            console.error(
                "Error adding expense:",
                error.response?.data?.message || error.message
            );
        }
    };

    // Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

            setOpenDeleteAlert({show: false, data: null});
            toast.success("Разход успешно изтрит");
            fetchExpenseDetails();
        } catch (error) {
            console.error(
                "Error deleting expense:",
                error.response?.data?.message || error.message
            );
        }
    };

    const { convertTransactions, currencySymbol, activeCurrency } = useCurrency();
    const convertedExpenseData = convertTransactions(expenseData);

    // Handle Download Expense Details
    // Updated to include currency parameter for Excel export with converted values
    const handleDownloadExpenseDetails = async  () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.EXPENSE.DOWNLOAD_EXPENSES,
                {
                    params: { currency: activeCurrency.code },
                    responseType: "blob",
                }
            );

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "expense_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading expense details:", error);
            toast.error("Неуспешно изтегляне на разходите. Моля, опитайте отново.");
        }
    };

    useEffect(() => {
        fetchExpenseDetails();

        return () => {};
    }, []);
        

    return(
        <DashboardLayout activeMenu="Разход">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="">
                        <ExpenseOverview
                            transactions={convertedExpenseData}
                            currencySymbol={currencySymbol}
                            onExpenseIncome={() => setOpenAddExpenseModal(true)}
                        />
                    </div>

                    <ExpenseList
                        transactions={convertedExpenseData}
                        currencySymbol={currencySymbol}
                        onDelete={(id) => {
                            setOpenDeleteAlert({ show: true, data: id });
                        }}
                        onDownload={handleDownloadExpenseDetails}
                    />
                </div>

                <Modal
                  isOpen={openAddExpenseModal}
                  onClose={() => setOpenAddExpenseModal(false)}
                  title="Добави разход"
                >
                  <AddExpenseForm onAddExpense={handleAddExpense} />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null, })}
                    title="Изтрий разход"
                >
                    <DeleteAlert
                        content="Сигурен ли сте, че искате да изтриете този разход?"
                        onDelete={() => deleteExpense(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Expense;