import html2pdf from "html2pdf.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getOrderStatusDetail, useBasicInformation } from "../services/api";
import { formatNumber, notify } from "../utils/helperFunctions";

import stamp from "../assets/images/stamp.webp";

import classes from "./Factor.module.css";

// Helper function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const FactorHeader = React.memo(({ detailsData, storeData, t, lng }) => {
  return (
    <thead className={classes.invoiceHeaderContainer}>
      {detailsData && (
        <tr>
          <td colSpan="13">
            <div className={classes.head}>
              <span className={classes.dateWrapper}>
                <span>{t("factor.Serial_Number")}</span>
                <span className={`${classes.center} ${classes.border}`}>
                  {detailsData.order.order_number}
                </span>
                <span>{t("factor.Date")}</span>
                <span className={`${classes.center} ${classes.border}`}>
                  {formatDate(detailsData.order.created_at)}
                </span>
              </span>
              <h1 className={classes.title}>
                {t("factor.Service_Sales_Invoice")}
              </h1>
              <span></span>
            </div>
          </td>
        </tr>
      )}
      <tr>
        <td colSpan="13" className={classes.sectionTitle}>
          {t("factor.Buyer_Information")}
        </td>
      </tr>
      <tr className={classes.header_information}>
        <td colSpan="4">
          {t("factor.Name_Individual_Legal_Entity")}
          {detailsData.user.first_name} {detailsData.user.last_name}
        </td>
        <td colSpan="3">
          {t("factor.Postal_Code")}
          {detailsData.address.postal_code}
        </td>
        <td colSpan="3">
          {t("factor.Phone_Number")}
          {detailsData.address.tel}
        </td>
      </tr>
      <tr className={classes.header_information}>
        <td colSpan="13">
          {t("factor.Address")}
          {detailsData.address.address}
        </td>
      </tr>
      <tr>
        <td colSpan="13" className={classes.sectionTitle}>
          {t("factor.Seller_Information")}
        </td>
      </tr>
      <tr className={classes.header_information}>
        <td colSpan={4}>
          {t("factor.Name_Individual_Legal_Entity")}
          {lng === "fa" ? storeData.name : storeData.name_en}
        </td>
        <td colSpan={3}>
          {t("factor.Postal_Code")}
          {storeData.postalCode}
        </td>
        <td colSpan={3}>
          {t("factor.Phone_Number")}
          {storeData.tel}
        </td>
      </tr>
      <tr className={classes.header_information}>
        <td colSpan={11} className={classes.address}>
          {t("factor.Address")}
          {lng === "fa" ? storeData.address : storeData.address_en}
        </td>
      </tr>

      <tr>
        <td colSpan="13" className={classes.sectionTitle}>
          {t("factor.Details_of_Goods_or_Services_Transacted")}
        </td>
      </tr>
      <tr className={classes.productHeaderRow}>
        <th>#</th>
        <th>{t("factor.material")}</th>
        <th>{t("signle_shape")}</th>
        <th>{t("cut_cut")}</th>
        <th>{t("size")}</th>
        <th>{t("color")}</th>
        <th>{t("factor.Unit_Weight")}</th>
        <th>{t("factor.Total_Weight")}</th>
        <th>{t("factor.Quantity_Amount")}</th>
        <th>{t("factor.Unit_Price")}</th>
        <th>{t("availability")}</th>
        <th>{t("factor.off")}</th>
        <th>{t("factor.Total_Amount")}</th>
      </tr>
    </thead>
  );
});

const ProductItem = React.memo(({ product, index, lng, t, euro }) => {
  const prod = product.product;
  const weight = prod.variation.weight.split(" ").at(0);
  return (
    <tr className={classes.productRow}>
      <td>{index + 1}</td>
      <td>{lng === "fa" ? prod.detail_fa : prod.detail}</td>
      <td>{lng === "fa" ? prod.shape_fa : prod.shape}</td>
      <td>{lng === "fa" ? prod.cut_fa : prod.cut}</td>
      <td>{prod.size}</td>
      <td>{lng === "fa" ? prod.color_fa : prod.color}</td>
      <td>{weight}</td>
      <td>{+(product.selected_quantity * weight).toFixed(3)}</td>
      <td>{product.selected_quantity}</td>
      <td>
        {lng === "fa"
          ? `${formatNumber(+prod.sale_price * euro)}`
          : `${prod.sale_price}`}
      </td>
      <td>
        {!prod.variation.is_not_available
          ? t("available")
          : t("newpage.newpage")}
      </td>
      <td style={{ color: "red" }}>---</td>
      <td>
        <strong>
          {lng === "fa"
            ? `${formatNumber(
                +prod.sale_price * euro * product.selected_quantity
              )}`
            : `${
                Math.round(prod.sale_price * product.selected_quantity * 10) /
                10
              }`}
        </strong>
      </td>
    </tr>
  );
});

const FactorProducts = React.memo(({ detailsData, t, lng, euro }) => {
  if (!detailsData) return <tbody />;
  return (
    <tbody className={classes.productSection}>
      {detailsData.products.map((product, i) => (
        <ProductItem
          key={product.id}
          product={product}
          index={i}
          lng={lng}
          t={t}
          euro={euro}
        />
      ))}
    </tbody>
  );
});

const FactorSummory = React.memo(
  ({ detailsData, t, lng, totalWeight, totalQuantity, shippingCost }) => {
    return (
      <tbody className={`${classes.summarySection} summarySection`}>
        <tr className={classes.summaryRow}>
          <td colSpan="5"></td>
          <td colSpan="1" className={classes.summaryLabel}>
            {t("shopping_cart.total")}:
          </td>
          <td className={classes.summaryValue}>
            {+totalWeight.toFixed(3)}&nbsp;Ct
          </td>
          <td className={classes.summaryValue}>
            {totalQuantity}&nbsp;{t("factor.pcs")}
          </td>
          <td colSpan="4"></td>
          <td className={classes.summaryValue}>
            <strong>
              {lng === "fa" ? (
                <>
                  {detailsData.order.total_amount_fa} {t("m_unit")}
                  <br />
                  (€&nbsp;{detailsData.order.total_amount})
                </>
              ) : (
                <>
                  {Math.round(detailsData.order.total_amount * 10) / 10}
                  {t("m_unit")}
                </>
              )}
            </strong>
          </td>
        </tr>
        <tr className={classes.summaryRow}>
          <td colSpan="5"></td>

          <td colSpan="1" className={classes.summaryLabel}></td>
          <td colSpan="4"> </td>
          <td colSpan="2"> {t("factor.club")}</td>
          <td className={classes.summaryValue}>
            {lng === "fa" ? detailsData.wallet_fa : detailsData.wallet_en}
            &nbsp;{t("m_unit")}
          </td>
        </tr>
        <tr className={classes.summaryRow}>
          <td colSpan="5"></td>

          <td colSpan="1" className={classes.summaryLabel}></td>
          <td colSpan="4"></td>
          <td colSpan="2"> {t("factor.shipping")}</td>
          <td className={classes.summaryValue}>{shippingCost}</td>
        </tr>
        <tr className={classes.summaryRow}>
          <td colSpan="5"></td>

          <td
            colSpan="1"
            className={classes.summaryLabel}
            style={{ fontWeight: "bold" }}
          ></td>
          <td colSpan="4"></td>
          <td colSpan="2">{t("orders.total_payment")}</td>

          <td className={classes.summaryValue}>
            <strong>
              {lng === "fa" ? (
                <>
                  {formatNumber(+detailsData.order.paying_amount_fa)}{" "}
                  {t("m_unit")}
                  <br />
                  (€&nbsp;
                  {(
                    Math.round(+detailsData.order.paying_amount * 10) / 10
                  ).toFixed(2)}
                  )
                </>
              ) : (
                <>
                  {(
                    Math.round(+detailsData.order.paying_amount * 10) / 10
                  ).toFixed(2)}{" "}
                  {t("m_unit")}
                </>
              )}
            </strong>
          </td>
        </tr>
      </tbody>
    );
  }
);

const FactorFooter = React.memo(({ t }) => {
  return (
    <tfoot className={`${classes.invoiceFooterContainer} print-fo`}>
      <tr>
        <td colSpan="6" className={classes.signatureColumn}>
          <p>{t("factor.Shops_Stamp_and_Signature")}</p>
          <img src={stamp} alt="" width={100} height={100} />
        </td>
        <td colSpan="7" className={classes.signatureColumn}>
          <p>{t("factor.Buyers_Stamp_and_Signature")}</p>
        </td>
      </tr>
    </tfoot>
  );
});

const Factor = () => {
  const [detailsData, setDetailsData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const componentRef = useRef();
  const { id } = useParams();
  const { data: storeInformation } = useBasicInformation();

  const lng = useSelector((state) => state.localeStore.lng);
  const token = useSelector((state) => state.userStore.token);
  const euro = useSelector((state) => state.cartStore.euro);

  const { t } = useTranslation();

  useEffect(() => {
    const handleGetDetails = async (orderId) => {
      if (orderId && token) {
        try {
          const serverRes = await getOrderStatusDetail(token, orderId);
          if (serverRes.response.ok) {
            setDetailsData(serverRes.result.orders);
            console.log(serverRes.result);
          } else {
            notify(t("trylater"));
          }
        } catch (error) {
          console.error("Failed to fetch order details:", error);
          notify(t("trylater"));
        }
      }
    };
    handleGetDetails(id);
  }, [id, token, t]);

  useEffect(() => {
    if (storeInformation) {
      setStoreData(storeInformation.data.at(0));
    }
  }, [storeInformation]);

  const { totalWeight, totalQuantity } = useMemo(() => {
    if (!detailsData?.products) {
      return { totalWeight: 0, totalQuantity: 0 };
    }

    return detailsData.products.reduce(
      (acc, item) => {
        if (item.product?.variation?.weight) {
          const weightString = item.product.variation.weight.trim();
          const numericWeight = parseFloat(weightString.split(" ")[0]);

          if (!isNaN(numericWeight)) {
            acc.totalWeight += numericWeight * item.selected_quantity;
            acc.totalQuantity += item.selected_quantity;
          }
        }
        return acc;
      },
      { totalWeight: 0, totalQuantity: 0 }
    );
  }, [detailsData]);

  const renderPaginatedPDF = () => {
    const sourceEl = componentRef.current;
    if (!sourceEl || !detailsData) return;

    setIsGeneratingPdf(true);

    const originalTable = sourceEl.querySelector("table");
    const container = document.createElement("div");
    container.style.width = "210mm";
    container.style.margin = "0 auto";

    const header = originalTable.querySelector("thead").cloneNode(true);
    const body = originalTable.querySelector("tbody").cloneNode(true);
    const summary = originalTable
      .querySelector(`.${classes.summarySection}`)
      ?.cloneNode(true);
    const footer = originalTable.querySelector("tfoot").cloneNode(true);

    const ROWS_PER_PAGE = 10;
    const productRows = Array.from(body.querySelectorAll("tr"));
    const totalPages = Math.ceil(productRows.length / ROWS_PER_PAGE);

    const productChunks = [];
    for (let i = 0; i < productRows.length; i += ROWS_PER_PAGE) {
      productChunks.push(productRows.slice(i, i + ROWS_PER_PAGE));
    }

    // Create pages
    productChunks.forEach((chunk, pageIndex) => {
      const page = document.createElement("div");
      page.className = "page";
      page.style.width = "210mm";
      page.style.minHeight = "297mm";
      page.style.padding = "5mm";
      page.style.boxSizing = "border-box";
      page.style.position = "relative";
      page.style.marginBottom = "15mm";

      const pageTable = document.createElement("table");
      pageTable.className = classes.factorTable;
      pageTable.dir = lng === "fa" ? "rtl" : "ltr";

      // Add header
      pageTable.appendChild(header.cloneNode(true));

      // Add product rows
      const pageBody = document.createElement("tbody");
      chunk.forEach((row) => pageBody.appendChild(row.cloneNode(true)));
      pageTable.appendChild(pageBody);

      // For the last page, add summary before footer
      if (pageIndex === productChunks.length - 1) {
        const summaryBody = document.createElement("tbody");
        summaryBody.className = classes.summarySection;
        const summaryRows = Array.from(summary.querySelectorAll("tr"));
        summaryRows.forEach((row) => {
          const newRow = row.cloneNode(true);
          Array.from(newRow.querySelectorAll("[colspan]")).forEach((cell) => {
            cell.setAttribute("colspan", cell.getAttribute("colspan"));
          });
          summaryBody.appendChild(newRow);
        });
        pageTable.appendChild(summaryBody);
      }

      // Add footer
      pageTable.appendChild(footer.cloneNode(true));

      // Add page number below the table (outside the table structure)
      const pageNumber = document.createElement("div");
      pageNumber.style.position = "absolute";
      pageNumber.style.bottom = "50mm"; // Position below the footer
      pageNumber.style.left = "0";
      pageNumber.style.right = "0";
      pageNumber.style.textAlign = "center";
      pageNumber.style.fontSize = "10px";
      pageNumber.textContent = `${pageIndex + 1}/${totalPages}`;

      page.appendChild(pageTable);
      page.appendChild(pageNumber); // Add page number to the page
      container.appendChild(page);
    });

    const options = {
      margin: 5,
      filename: `invoice-${detailsData.order.order_number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        width: 794,
        windowWidth: 794,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        hotfixes: ["px_scaling"],
      },
    };

    document.body.appendChild(container);

    html2pdf()
      .from(container)
      .set(options)
      .save()
      .catch((err) => {
        console.error("PDF Error:", err);
        notify("Failed to generate PDF");
      })
      .finally(() => {
        document.body.removeChild(container);
        setIsGeneratingPdf(false);
      });
  };
  if (!detailsData) {
    return (
      <div className={classes.loader_wrapper}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={classes.invoiceContainer}>
      <div className={classes.controlsContainer}>
        <button
          onClick={renderPaginatedPDF}
          className={classes.downloadButton}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf
            ? t("factor.generating_pdf")
            : t("factor.download_pdf")}
        </button>
      </div>
      <div ref={componentRef}>
        <table
          className={classes.factorTable}
          dir={lng === "fa" ? "rtl" : "ltr"}
        >
          <FactorHeader
            detailsData={detailsData}
            storeData={storeData}
            t={t}
            lng={lng}
          />
          <FactorProducts
            detailsData={detailsData}
            t={t}
            lng={lng}
            euro={euro}
          />
          <FactorSummory
            detailsData={detailsData}
            t={t}
            lng={lng}
            totalWeight={totalWeight}
            totalQuantity={totalQuantity}
            shippingCost={detailsData.shipping || 0}
          />
          <FactorFooter t={t} />
        </table>
      </div>
    </div>
  );
};

export default Factor;
