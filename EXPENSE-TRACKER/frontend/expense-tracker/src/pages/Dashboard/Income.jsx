import React, {useState, useEffect} from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useCurrency } from "../../context/CurrencyContext";

// Income page - Manages all income transactions with add, delete, and download functionality
const Income = () => {
    useUserAuth();

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

    // Fetch all income transactions for current user
    // Fetch all income transactions for current user from API
    const fetchIncomeDetails = async () => {
        // Prevent multiple simultaneous requests if already loading
        if(loading) return;

        setLoading(true);

        try{
            // API call to retrieve all income records for authenticated user
            const response = await axiosInstance.get(
                `${API_PATHS.INCOME.GET_ALL_INCOME}`
            );

            // Update component state with fetched income data
            if(response.data){
                setIncomeData(response.data);
            }
        } catch (error) {
            console.log("Something went wrong. Please try again.", error);
        } finally {
            // Always disable loading state, whether request succeeded or failed
            setLoading(false);
        }
    };

    // Handle Add Income - Validates input and sends new income to API
    const handleAddIncome = async (income) => {
        // Destructure income object to extract form fields
        const {source, amount, date, icon} = income;

        // Perform validation checks before submitting
        if (!source.trim()){
            toast.error("Източникът на приход е задължителен.");
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
            await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                source,
                amount,
                date,
                icon,
            });

            setOpenAddIncomeModal(false);
            toast.success("Приход добавен успешно.");
            fetchIncomeDetails();
        } catch (error) {
            console.error(
                "Error adding income:",
                error.response?.data?.message || error.message
            );
        }
    };

    // Delete Income
    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

            setOpenDeleteAlert({show: false, data: null});
            toast.success("Приход успешно изтрит");
            fetchIncomeDetails();
        } catch (error) {
            console.error(
                "Error deleting income:",
                error.response?.data?.message || error.message
            );
        }
    };

    const { convertTransactions, currencySymbol, activeCurrency } = useCurrency();
    const convertedIncomeData = convertTransactions(incomeData);

    // Handle Download Income Details
    // Updated to include currency parameter for Excel export with converted values
    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.INCOME.DOWNLOAD_INCOME,
                {
                    params: { currency: activeCurrency.code },
                    responseType: "blob",
                }
            );
        
            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "income_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading income details:", error);
            toast.error("Неуспешно изтегляне на приходите. Моля, опитайте отново.");
        }
    };

    useEffect(() => {
        fetchIncomeDetails();

        return () => {};
    }, []);

    return (
        <DashboardLayout activeMenu="Приход">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="">
                        <IncomeOverview
                            transactions={convertedIncomeData}
                            currencySymbol={currencySymbol}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>

                    <IncomeList
                        transactions={convertedIncomeData}
                        currencySymbol={currencySymbol}
                        onDelete={(id) => {
                            setOpenDeleteAlert({ show: true, data: id});
                        }}
                        onDownload={handleDownloadIncomeDetails}
                    />
                </div>

                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => setOpenAddIncomeModal(false)}
                    title="Добави приход"
                >
                    <AddIncomeForm onAddIncome={handleAddIncome} />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null, })}
                    title="Изтрий приход"
                >
                    <DeleteAlert
                        content="Сигурен ли сте, че искате да изтриете този приход?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Income;