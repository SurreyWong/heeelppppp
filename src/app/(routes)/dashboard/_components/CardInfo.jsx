import {
    PiggyBank,
    ReceiptText,
    Wallet,
    Sparkles,
    CircleDollarSign,
    BicepsFlexed
} from "lucide-react";

import React, {useEffect, useState} from "react";
import getFinancialAdvice from "utils/getFinancialAdvice";

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-MY', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

function CardInfo({ budgetList, incomeList, expenseList}){
    const[totalBudget, setTotalBudget] = useState(0)
    const [totalSpend, setTotalSpend] =useState(0)
    const [totalIncome, setTotalIncome] = useState(0)
    const [financialAdvice, setFinancialAdvice]=useState('')
    const incomeMinusBudget = totalIncome - totalBudget;
    const overBudget = totalBudget > totalIncome;

    useEffect(()=>{
        if(budgetList.length>0 || incomeList.length>0){
            CalculateCardInfo();
        }

    }, [budgetList, incomeList]);

    useEffect(() => {
      if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
        const fetchFinancialAdvice = async () => {
          const advice = await getFinancialAdvice(
            totalBudget,
            totalIncome,
            totalSpend
          );
          setFinancialAdvice(advice);
        };
  
        fetchFinancialAdvice();
      }
    }, [totalBudget, totalIncome, totalSpend]);

    const CalculateCardInfo=() =>{
        let totalBudget_ =0;
        let totalSpend_=0;
        let totalIncome_=0;

        budgetList.forEach((element)=>{
            totalBudget_ = totalBudget_ + Number(element.amount)
            totalSpend_ = totalSpend_ + element.totalSpend;

          })
          incomeList.forEach((element) => {
            totalIncome_ = totalIncome_ + Number(element.amount);
          });

          setTotalBudget(totalBudget_);
          setTotalSpend(totalSpend_);
          setTotalIncome(totalIncome_);
    };
    return (
        <div>
          {budgetList?.length > 0 ? (
            <div>
              <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between">
                <div className="">
                  <div className="flex mb-2 flex-row space-x-1 items-center ">
                    <h2 className="text-md ">PocketFlow AI</h2>
                    <Sparkles
                      className="rounded-full text-white w-10 h-10 p-2
        bg-gradient-to-r
        from-pink-500
        via-red-500
        to-yellow-500
        background-animate"
                    />
                  </div>
                  <h2 className="font-light text-md">
                    {financialAdvice || "Loading financial advice..."}
                  </h2>
                </div>
              </div>
    
              <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-7 border rounded-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-sm">Total Budget</h2>
                    <h2 className="font-bold text-2xl">
                      RM{formatNumber(totalBudget)}
                    </h2>
                  </div>
                  <PiggyBank className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
                </div>
                <div className="p-7 border rounded-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-sm">Total Spend</h2>
                    <h2 className="font-bold text-2xl">
                      RM{formatNumber(totalSpend)}
                    </h2>
                  </div>
                  <ReceiptText className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
                </div>
                <div className="p-7 border rounded-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-sm">No. Of Budget</h2>
                    <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
                  </div>
                  <Wallet className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
                </div>
                <div
              className={`p-7 border rounded-2xl flex items-center justify-between ${
                overBudget ? "border-red-500 bg-red-50" : ""
              }`}
            >
              <div>
                    <h2 className="text-sm">Sum of Income Streams</h2>
                    <h2 className="font-bold text-2xl">
                      RM{formatNumber(totalIncome)}
                    </h2>
                    <p className="text-xs mt-1">
                    Difference with Total Budget:&nbsp;
                    <span className="font-medium">
                    RM{formatNumber(incomeMinusBudget)}
                    </span>
                    </p>
                  </div>
                  <CircleDollarSign className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
                </div>
                
                <div className="p-7 border rounded-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-sm">Total Saving</h2>
                    <h2 className="font-bold text-2xl">
                      RM{formatNumber(totalBudget- totalSpend)}
                    </h2>
                  </div>
                  <BicepsFlexed className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
                </div>

              </div>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((item, index) => (
                <div
                  className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
                  key={index}
                ></div>
              ))}
            </div>
          )}
        </div>
      );
    }
    export default CardInfo;
