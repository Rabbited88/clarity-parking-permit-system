;; Define data variables 
(define-map permits 
    { permit-id: uint }
    {
        owner: principal,
        valid-until: uint,
        zone: (string-ascii 10),
        vehicle-id: (string-ascii 20)
    }
)

(define-data-var permit-counter uint u0)
(define-data-var admin principal tx-sender)

;; Define constants
(define-constant err-not-admin (err u100))
(define-constant err-permit-not-found (err u101))
(define-constant err-permit-expired (err u102))
(define-constant err-invalid-duration (err u103))

;; Read only functions
(define-read-only (get-permit (permit-id uint))
    (match (map-get? permits {permit-id: permit-id})
        permit (ok permit)
        err-permit-not-found
    )
)

(define-read-only (is-valid-permit (permit-id uint))
    (match (map-get? permits {permit-id: permit-id})
        permit (ok (> (get valid-until permit) block-height))
        err-permit-not-found
    )
)

;; Public functions
(define-public (issue-permit (owner principal) (duration uint) (zone (string-ascii 10)) (vehicle-id (string-ascii 20)))
    (begin
        (asserts! (is-eq tx-sender (var-get admin)) err-not-admin)
        (asserts! (> duration u0) err-invalid-duration)
        
        (let
            (
                (new-permit-id (+ (var-get permit-counter) u1))
                (expires-at (+ block-height duration))
            )
            
            (map-set permits
                {permit-id: new-permit-id}
                {
                    owner: owner,
                    valid-until: expires-at,
                    zone: zone,
                    vehicle-id: vehicle-id
                }
            )
            
            (var-set permit-counter new-permit-id)
            (ok new-permit-id)
        )
    )
)

(define-public (revoke-permit (permit-id uint))
    (begin
        (asserts! (is-eq tx-sender (var-get admin)) err-not-admin)
        (map-delete permits {permit-id: permit-id})
        (ok true)
    )
)

(define-public (transfer-permit (permit-id uint) (new-owner principal))
    (let ((permit (unwrap! (map-get? permits {permit-id: permit-id}) err-permit-not-found)))
        (asserts! (is-eq tx-sender (get owner permit)) err-not-admin)
        (asserts! (> (get valid-until permit) block-height) err-permit-expired)
        
        (map-set permits
            {permit-id: permit-id}
            {
                owner: new-owner,
                valid-until: (get valid-until permit),
                zone: (get zone permit),
                vehicle-id: (get vehicle-id permit)
            }
        )
        (ok true)
    )
)
