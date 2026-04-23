import { useState, useEffect, useRef } from "react";
import { getMarkerQrBlobUrl } from "../services/maintenanceReports";

export function useMarkerUrl(reportId) {
  const [markerUrl, setMarkerUrl] = useState(null);
  const urlRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getMarkerQrBlobUrl(reportId).then((result) => {
      if (result.success && mounted) {
        urlRef.current = result.url;
        setMarkerUrl(result.url);
      }
    });
    return () => {
      mounted = false;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [reportId]);

  return markerUrl;
}
