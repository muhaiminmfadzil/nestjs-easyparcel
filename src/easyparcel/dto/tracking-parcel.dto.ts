interface TrackingParcelAwb {
  // Required data
  awb_no: string;
}
export class TrackingParcelDto {
  bulk: TrackingParcelAwb[];
}
